module.exports = async function () {

	console.info('\n', 'this.infos', '\n', JSON.stringify(this.infos))

	for (const info of this.infos) {

		if (!state.isChecking) {
			return;
		}

		if (session.remainingMinutes < 1) {
            await this.emit('stop', 'Tempo de sessão expirado')
            return;
        }

		const infoStored = await this.checkStored(info);

		// found on collection. used before
		if (infoStored) {
			
			console.info(`Info already checked before`)
			console.info(`Returning stored checked info`)

			util.sleep(12000)
			
			await this.emit('check', infoStored)

		} else if (info.status === 'DEAD') {

			console.info(`Info is DEAD by Validity check at incoming`)
			console.info('Returning it as it is')
		
			util.sleep(12000)
			
			await this.emit('check', info)
		
		} else {

			console.info(`Info is neither Invalid nor DEAD from Validity`)
			console.info(`Performing check on the gateway`)
			
			await main.call(this)
		}

		async function main () {

			if (info.month.length === 4) {
				info.month = info.month.slice(2)
			}

			try {

				await this.emit('check-status-update', 'Baixando e definindo dados da BIN', 25)
			
				let binData = await this.getBinData(info)
				
				info.bank = binData.bank
				info.level = binData.level	

				try {
					
					await this.emit('check-status-update', 'Rotacionando IP do Servidor Proxy', 50)
					
					// rotate/change proxyServer ip
					await this.changeProxyServerIp()

					// above wont work without this
					util.sleep(12000)

					try {

						await this.emit('check-status-update', 'Realizando cobrança no Gateway', 65)

						// finally performs stripe charge
						const infoCharged = await this.stripeCharge(info)

						await this.emit('check', infoCharged)
						await this.emit('check-status-update', 'Finalizando...', 75)

						// since info dindt fall on first conditional (checkStored)
						// and is a live, store it on mongo collection server
						
						try {

							await this.storeCheck(infoCharged)
							await this.emit('check-status-update', 'Check concluído', 100)

						} catch (error) {
							await this.emit('error', 
								error.toString(error), 
									'Fail at this.storeCheck()',
										info)
						}
						
					} catch (error) {
						await this.emit('error', 
							error.toString(error), 
								'Fail at this.stripeCharge()',
									info)
					}

				} catch (error) {
					await this.emit('error', 
						error.toString(error), 
							'Fail at this.changeProxyServerIp()',
								info)
				}

			} catch (error) {
				await this.emit('error', 
						error.toString(), 
							'Fail at this.getBinData()',
								info)
			}

		}

		// if is the last info checked
		if (info.number === this.infos[this.infos.length - 1].number) {
			await this.emit('stop', "Check's terminadas")
			return;
		}

	}
	
}
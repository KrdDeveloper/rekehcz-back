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

		const infoStored = await this.checkStored(info)

		if (infoStored) {
			util.sleep(6000)
			await this.emit('check', infoStored)
		} else if (info.status === 'DEAD') {
			util.sleep(6000)
			await this.emit('check', info)
		} else {
			
			await main.call(this)

			// if is the last info checked
			if (info.number === this.infos[this.infos.length - 1].number) {
				await this.emit('stop')
			}
		}

		async function main () {

			try {

				await this.emit('check-status-update', 
								'Baixando e definindo dados da BIN', 25)
			
				let binData = await this.getBinData(info)
				
				info.bank = binData.bank
				info.level = binData.level	

				try {
					
					await this.emit('check-status-update', 
								'Rotacionando IP do Servidor Proxy', 50)
					
					// rotate/change proxyServer ip
					await this.changeProxyServerIp()

					// above wont work without this
					util.sleep(6000)

					try {

						await this.emit('check-status-update', 
									'Realizando cobrança no Gateway', 65)

						// finally performs stripe charge
						const infoCharged = await this.stripeCharge(info)

						if (infoCharged.status === "DEAD") {
							await this.emit('check-status-update', 
										'DEAD', 100)
							return;
						}

						if (infoCharged.status === "LIVE") {
							await this.emit('check', info)
						}

						await this.emit('check-status-update', 
										'Finalizando...', 75)

						// since info dindt fall on first conditional (checkStored)
						// and is a live, store it on mongo collection server
						try {

							await this.storeCheck(info)
							await this.emit('check-status-update', 
											'Check concluído', 100)
						} catch (error) {
							await this.emit('check-error', 
								error.toString(error), 
									'Fail at this.storeCheck()')
						}

					} catch (error) {
						await this.emit('check-error', 
							error.toString(error), 
								'Fail at this.stripeCharge()')
					}

				} catch (error) {
					await this.emit('check-error', 
						error.toString(error), 
							'Fail at this.changeProxyServerIp()')
				}

			} catch (error) {
				await this.emit('check-error', 
						error.toString(), 
							'Fail at this.getBinData()')
			}
		}

		// if is the last info checked
		if (info.number === this.infos[this.infos.length - 1].number) {
			await this.emit('stop', "Check's terminadas")
			return;
		}

	}
	
}
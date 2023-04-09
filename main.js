const Checker = require('./Checker.js')

function main (wsServer) {

    wsServer.on('connection', (ws, messageCon) => {
        
        //send immediatly a feedback to the incoming connection    
        console.log('New incoming connection on Websocket.')
    
        //connection is up, let's add a simple simple event
        ws.on('message', async (message) => {

            message = JSON.parse(message.toString())

            console.log('message', message)
            
            if (message.intent === '/check-infos') {

                if (!global.isChecking) {
                    
                    // ----------------------------------
                    // ----------- main algorithm - start
                    // ----------------------------------

                    console.log('Initializing checker')
                    
                    global.isCheking = true
                    
                    // construct checker instance 
                    // message.data = array of infocc text
                    let checker = new Checker(message.data)
                    
                    // handles each info checked
                    checker.on('check', parsedInfo => {
                        ws.send({
                            întent: '/new-info',
                            data: parsedInfo,
                            text: 'New info checked'
                        })
                    })

                    // when checker checks all infos
                    checker.on('stop', () => {

                        global.isCheking = false;

                        ws.send({
                            intent: '/checker-finish',
                            text: 'Checker finished!'
                        })
                    })

                    // starts checker
                    checker.start()

                    // --------------------------------
                    // ----------- main algorithm - end
                    // --------------------------------
                }
                
                if (global.isChecking) {
                    
                    ws.send({
                        error: 'A check process is already running. Wait.'
                    })

                    return;
                }
            }

            if (message.intent === '/other') {

            }

        })
    });
}

module.exports = main;
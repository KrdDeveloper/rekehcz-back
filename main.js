const axios = require('axios'),
         Checker = require('./Checker/index.js'),
            e = process.env;

function main (wsServer) {

    wsServer.on('connection', (ws, eventCon) => {
        
        //send immediatly a feedback to the incoming connection    
        console.log('New incoming connection on Websocket.')
    
        //connection is up, let's add a simple simple event
        ws.on('message', async (event) => {

            // events form front-end
            let ev = JSON.parse(event.toString())

            // an event handler 
            if (ev.name === 'pick-infos') {

                if (global.isChecking) {    
                    ws.send(JSON.stringify({
                        name: 'error',
                        data: 'A check process is already running. Wait.'
                    }))
                }

                if (!global.isChecking) {
                    
                    // ----------------------------------
                    // ----------- main algorithm - start
                    // ----------------------------------

                    console.log('Initializing checker')
                    
                    global.isChecking = true;
                    
                    // construct checker instance 
                    // ev.data = array of infocc text
                    let checker = new Checker(ev.data)
                    
                    // handles each info checked
                    checker.on('check', infoParsed => {
                        ws.send(JSON.stringify({ 
                            name: 'check', 
                            data: infoParsed 
                        })) // no front >>> ev|
                    })

                    // handles check error
                    checker.on('check-error', error => {
                        ws.send(JSON.stringify({ 
                                name: 'error', data: error 
                        }))
                    })

                    // when checker checks all infos
                    checker.on('stop', () => {
                        
                        global.isChecking = false;
                        
                        ws.send(JSON.stringify({ 
                                name: 'check-finish', 
                                data: null 
                        }))
                    })

                    // starts checker
                    await checker.start()

                    // --------------------------------
                    // ----------- main algorithm - end
                    // --------------------------------
                }
            }

            if (ev.name === '/other') {

            }

        })
    });
}

module.exports = main;
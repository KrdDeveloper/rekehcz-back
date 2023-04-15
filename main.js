const axios = require('axios'),
         Checker = require('./Checker/index.js'),
            Session = require('./Session/index.js'),
                e = process.env;

function main (wss) {

    // ------------------------------------------
    // handles new websocket incoming connections
    // ------------------------------------------

    wss.on('connection', (ws, message) => {

        // enforces single connection by keeping the first only
        // ... and blocking any other
        if (wss.clients.size !== 1) {
            ws.send('close')
            ws.close(); 
            return;
        }

        // if global.session is set
        if (!global.session) {
             global.session = new Session()
        }

        ws.send(JSON.stringify({
            name: 'session-update',
            data: global.session
        }))

        console.info('global.session', global.session)

        // send immediatly a feedback to the incoming connection    
        console.log('New incoming connection on Websocket')

        // -------------------------------------------------
        // connection is up, let's add a simple simple event
        // -------------------------------------------------

        ws.on('message', async (event) => {

            // an event handler from front-end
            let ev = JSON.parse(event.toString())

            // an event handler from front-end
            if (ev.name === 'check-infos') {

                if (state.isChecking) {    
                    
                    ws.send(JSON.stringify({
                        name: 'check-error',
                        data: { 
                            error: 'A check process is still running', 
                            message: 'Fail at check-infos event'
                        }
                    }))

                    return;
                }
                    
                // ----------------------------------
                // ----------- main algorithm - start
                // ----------------------------------

                console.log('Initializing checker')

                state.isChecking = true;
                
                // construct checker instance 
                // ev.data = array of infocc text
                let checker = new Checker(ev.data)
                
                // handles each info checked
                checker.on('check', infoParsed => {
                    ws.send(JSON.stringify({ 
                        name: 'check', 
                        data: infoParsed 
                    }))
                })

                checker.on('check-status-update', (status, progress) => {
                    ws.send(JSON.stringify({
                        name: 'check-status-update',
                        data: { status, progress }
                    }))
                })

                // handles check error
                checker.on('check-error', (error, errmsg) => {
                    ws.send(JSON.stringify({ 
                        name: 'check-error', 
                        data: { error, message: errmsg }
                    }))
                })

                // when checker checks all infos
                checker.on('stop', stopmsg => {

                    state.isChecking = false;
                    
                    ws.send(JSON.stringify({ 
                        name: 'stop', 
                        data: { message: stopmsg }
                    }))
                })

                // starts checker
                checker.startCheckLoop()

                // --------------------------------
                // ----------- main algorithm - end
                // --------------------------------
            }

        })
    });
}

module.exports = main;
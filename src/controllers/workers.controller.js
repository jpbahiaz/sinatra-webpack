// Initially one file, modularize if necessary
import ExampleWorker from '../workers/example.worker'

export const WorkersController = (function(){

    const worker = new ExampleWorker()
    
    function addListener(fn){
        worker.addEventListener('message', fn)
    }

    function sendData(data){
        worker.postMessage(data)
    }
    return {
        sendData,
        addListener,
        init: () => {
            console.log("Initializing WorkersController")
        }
    }
})()
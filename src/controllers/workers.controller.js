// Initially one file, modularize if necessary
import { ExampleService } from '../services/example.service'
import ExampleWorker from '../workers/example.worker';

export const WorkersController = (function(){

    const worker = new ExampleWorker();
    worker.addEventListener('message', function(data){
        // Add ResultController handler to show the results
        console.log(data)
    });

    function sendData(data){
        worker.postMessage(data);
    }
    return {
        sendData,
        init: () => {
            console.log("Initializing WorkersController")
        }
    }
})();
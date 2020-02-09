// Initially one file, modularize if necessary
import './states.styles.scss';
import { ExampleService } from '../services/example.service'
import ExampleWorker from '../workers/example.worker';

export const StateController = (function(){

    const appState = {
        currentState: null,
        content: {
            text: null,
            file: null
        },
        codonTable: codonTable
    };

    const worker = new AnalyzerWorker();
    worker.addEventListener('message', function(data){
        // Add ResultController handler to show the results
        console.log(data)
    });

    worker.postMessage();
    return {

    }
})();
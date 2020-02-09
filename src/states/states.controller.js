// Initially one file, modularize if necessary
import './states.styles.scss';
import { Analyzer } from '../services/analyzer.service'
import { ResultsController } from '../results/results.controller'
import AnalyzerWorker from '../workers/analyzer.worker';
import { codonTable } from './codonTable.model'

export const StateController = (function(){

    const StateSelectors = {
        currentState: '.current-state',
        heading: '.heading',
        stateContent: '.state-content',
        textInput: '.text-input',
        fileInput: '#file-input',
        patternInput: '.pattern',
        searchDnaBtn: '.search-dna',
        searchProteinBtn: '.search-protein',
        searchProteinDnaBtn: '.search-protein-dna',
        reverseComplementBtn: '.reverse-complement',
        translateBtn: '.translate',
        nucleotidTableBtn: '.nucleotid-table'
    }

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
        ResultsController.handleResults(data.data);
    });

    function change(state){
        appState.currentState = state;

        // Clear last state
        const currentState = document.querySelector(StateSelectors.currentState);
        if(currentState){
            currentState.classList.remove('current-state');
        }

        // Color state button and change heading
        document.querySelector(StateSelectors.heading).textContent = state.name;
        document.querySelector(state.selector).classList.add('current-state');
    }

    function clearStateContent(){
        const stateContent = Array.from(document.querySelector(StateSelectors.stateContent).children);
        stateContent.forEach(child => child.remove());
    }

    function getAppState(){
        const textInput = document.querySelector(StateSelectors.textInput);
        const fileInput = document.querySelector(StateSelectors.fileInput);

        appState.content.file = fileInput.files[0];
        appState.content.text = textInput.value;
        return appState;
    }
    
    /** Search Dna Pattern **/
    function searchDnaState(){
        this.name = 'Search DNA Pattern';
        this.selector = StateSelectors.searchDnaBtn;

        clearStateContent();
        document.querySelector(StateSelectors.stateContent).innerHTML = `
            <input class="pattern" type="text" placeholder="Insert DNA Pattern Ex.: C4G5-6T"/>
        `
        document.querySelector(StateSelectors.textInput).placeholder = 'Insert DNA...\nEx.:\n>DNA_identifier\naatggcgcatgactaaaaa';
    }
    searchDnaState.prototype.action = function(){
        console.log('Hi from Search DNA State!');
        const patternInput = document.querySelector(StateSelectors.patternInput);
        if(appState.content.text){
            const sequencesIt = Analyzer.matchSequences(appState.content.text);
            let currentSequence = sequencesIt.next();
            
            const date = new Date(); // Task Identifier based on date in msec
            while(!currentSequence.done){
                let sequenceContent = currentSequence.value.groups.sequence;
                let id = currentSequence.value.groups.id;
                worker.postMessage({
                    sequence: sequenceContent,
                    pattern: patternInput.value,
                    state: 'searchDna',
                    sequenceId: id,
                    identifier: date.getTime(),
                    source: 'Text'
                });
                currentSequence = sequencesIt.next();
            }
        }

        if(appState.content.file){
            Analyzer.readFastaFile(appState.content.file, function(iterator){
                let currentSequence = iterator.next();
                
                const date = new Date(); // Task Identifier based on date in msec
                while(!currentSequence.done){
                    let sequenceContent = currentSequence.value.groups.sequence;
                    let id = currentSequence.value.groups.id;
                    worker.postMessage({
                        sequence: sequenceContent,
                        pattern: patternInput.value,
                        state: 'searchDna',
                        sequenceId: id,
                        identifier: date.getTime(),
                        source: 'File'
                    });
                    currentSequence = iterator.next();
                }
            });
        }
    }
    //** ----------------------------------- **/
    
    /** Search Protein Pattern **/
    function searchProteinState(){
        this.name = 'Search Protein Pattern';
        this.selector = StateSelectors.searchProteinBtn;
        
        clearStateContent();
        document.querySelector(StateSelectors.stateContent).innerHTML = `
            <input class="pattern" type="text" placeholder="Insert Protein Pattern Ex.: R7N1-2DQ"/>
        `

        document.querySelector(StateSelectors.textInput).placeholder = 'Insert Protein...\nEx.:\n>Protein_identifier\nsaivgtgirviirtel';
    }
    searchProteinState.prototype.action = function(){
        console.log('Hi from Search Protein State!');
        const patternInput = document.querySelector(StateSelectors.patternInput);
        if(appState.content.text){
            const sequencesIt = Analyzer.matchSequences(appState.content.text);
            let currentSequence = sequencesIt.next();
            
            const date = new Date(); // Task Identifier based on date in msec
            while(!currentSequence.done){
                let sequenceContent = currentSequence.value.groups.sequence;
                let id = currentSequence.value.groups.id;
                worker.postMessage({
                    sequence: sequenceContent,
                    pattern: patternInput.value,
                    state: 'searchProtein',
                    sequenceId: id,
                    identifier: date.getTime(),
                    source: 'Text'
                });
                currentSequence = sequencesIt.next();
            }
        }

        if(appState.content.file){
            Analyzer.readFastaFile(appState.content.file, function(iterator){
                let currentSequence = iterator.next();
                
                const date = new Date(); // Task Identifier based on date in msec
                while(!currentSequence.done){
                    let sequenceContent = currentSequence.value.groups.sequence;
                    let id = currentSequence.value.groups.id;
                    worker.postMessage({
                        sequence: sequenceContent,
                        pattern: patternInput.value,
                        state: 'searchProtein',
                        sequenceId: id,
                        identifier: date.getTime(),
                        source: 'File'
                    });
                    currentSequence = iterator.next();
                }
            });
        }
    }
    //** ----------------------------------- **/

    /** Search Protein using DNA Pattern **/
    function searchProteinDnaState(){
        this.name = 'Search Protein using DNA';
        this.selector = StateSelectors.searchProteinDnaBtn;

        clearStateContent();
        document.querySelector(StateSelectors.stateContent).innerHTML = `
            <input class="pattern" type="text" placeholder="Insert Protein Pattern Ex.: M1Y3-5L"/>
        `

        document.querySelector(StateSelectors.textInput).placeholder = 'Insert DNA...\nEx.:\n>DNA_identifier\naatggcgcatgactaaaaa';
    }
    searchProteinDnaState.prototype.action = function(){
        console.log('Hi from Search Protein using DNA State!');
        const patternInput = document.querySelector(StateSelectors.patternInput);
        if(appState.content.text){
            const sequencesIt = Analyzer.matchSequences(appState.content.text);
            let currentSequence = sequencesIt.next();
            
            const date = new Date(); // Task Identifier based on date in msec
            while(!currentSequence.done){
                let sequenceContent = currentSequence.value.groups.sequence;
                let id = currentSequence.value.groups.id;
                worker.postMessage({
                    sequence: sequenceContent,
                    pattern: patternInput.value,
                    state: 'searchProteinDna',
                    sequenceId: id,
                    identifier: date.getTime(),
                    source: 'Text',
                    table: appState.codonTable
                });
                currentSequence = sequencesIt.next();
            }
        }

        if(appState.content.file){
            Analyzer.readFastaFile(appState.content.file, function(iterator){
                let currentSequence = iterator.next();
                
                const date = new Date(); // Task Identifier based on date in msec
                while(!currentSequence.done){
                    let sequenceContent = currentSequence.value.groups.sequence;
                    let id = currentSequence.value.groups.id;
                    worker.postMessage({
                        sequence: sequenceContent,
                        pattern: patternInput.value,
                        state: 'searchProteinDna',
                        sequenceId: id,
                        identifier: date.getTime(),
                        source: 'File',
                        table: appState.codonTable
                    });
                    currentSequence = iterator.next();
                }
            });
        }
    }
    //** ----------------------------------- **/

    /** Reverse Complement **/
    function reverseComplementState(){
        this.name = 'Reverse Complement';
        this.selector = StateSelectors.reverseComplementBtn;

        clearStateContent();
        document.querySelector(StateSelectors.textInput).placeholder = 'Insert DNA...\nEx.:\n>DNA_identifier\naatggcgcatgactaaaaa';
    }
    reverseComplementState.prototype.action = function(){
        console.log('Hi from Reverse Complement State!');
        if(appState.content.text){
            const sequencesIt = Analyzer.matchSequences(appState.content.text);
            let currentSequence = sequencesIt.next();
            
            const date = new Date(); // Task Identifier based on date in msec
            while(!currentSequence.done){
                let sequenceContent = currentSequence.value.groups.sequence;
                let id = currentSequence.value.groups.id;
                worker.postMessage({
                    sequence: sequenceContent,
                    state: 'reverseComplement',
                    sequenceId: id,
                    identifier: date.getTime(),
                    source: 'Text'
                });
                currentSequence = sequencesIt.next();
            }
        }

        if(appState.content.file){
            Analyzer.readFastaFile(appState.content.file, function(iterator){
                let currentSequence = iterator.next();
                
                const date = new Date(); // Task Identifier based on date in msec
                while(!currentSequence.done){
                    let sequenceContent = currentSequence.value.groups.sequence;
                    let id = currentSequence.value.groups.id;
                    worker.postMessage({
                        sequence: sequenceContent,
                        state: 'reverseComplement',
                        sequenceId: id,
                        identifier: date.getTime(),
                        source: 'File'
                    });
                    currentSequence = iterator.next();
                }
            });
        }
    }
    //** ----------------------------------- **/

    /** Translate DNA to Protein **/
    function translateState(){
        this.name = 'Translate',
        this.selector = StateSelectors.translateBtn

        clearStateContent();
        document.querySelector(StateSelectors.textInput).placeholder = 'Insert DNA...\nEx.:\n>DNA_identifier\naatggcgcatgactaaaaa';
    }
    translateState.prototype.action = function(){
        console.log('Hi from translate State!');
        const appState = getAppState();

        if(appState.content.text){
            const sequencesIt = Analyzer.matchSequences(appState.content.text);
            let currentSequence = sequencesIt.next();
            
            const date = new Date(); // Task Identifier based on date in msec
            while(!currentSequence.done){
                let sequenceContent = currentSequence.value.groups.sequence;
                let id = currentSequence.value.groups.id;
                worker.postMessage({
                    sequence: sequenceContent,
                    state: 'translate',
                    sequenceId: id,
                    identifier: date.getTime(),
                    source: 'Text',
                    table: appState.codonTable
                });
                currentSequence = sequencesIt.next();
            }
        }

        if(appState.content.file){
            Analyzer.readFastaFile(appState.content.file, function(iterator){
                let currentSequence = iterator.next();
                
                const date = new Date(); // Task Identifier based on date in msec
                while(!currentSequence.done){
                    let sequenceContent = currentSequence.value.groups.sequence;
                    let id = currentSequence.value.groups.id;
                    worker.postMessage({
                        sequence: sequenceContent,
                        state: 'translate',
                        sequenceId: id,
                        identifier: date.getTime(),
                        source: 'File',
                        table: appState.codonTable
                    });
                    currentSequence = iterator.next();
                }
            });
        }
    }
    //** ----------------------------------- 

    /** Nucleotid Table 
    function nucleotidTableState(){
        this.name = 'Nucleotid Table';
        this.selector = StateSelectors.nucleotidTableBtn;


        clearStateContent();
        document.querySelector(StateSelectors.textInput).placeholder = 'Insert DNA...\nEx.:\n>DNA_identifier\naatggcgcatgactaaaaa';;
    }
    nucleotidTableState.prototype.action = function(){
        console.log('Hi from Nucleotid Table State!');
    }
    //** ----------------------------------- **/

    function initEventListeners(){
        document.querySelector(StateSelectors.searchDnaBtn).addEventListener('click', function(){
            change(new searchDnaState);
        });

        document.querySelector(StateSelectors.searchProteinBtn).addEventListener('click', function(){
            change(new searchProteinState);
        });

        document.querySelector(StateSelectors.searchProteinDnaBtn).addEventListener('click', function(){
            change(new searchProteinDnaState);
        });

        document.querySelector(StateSelectors.reverseComplementBtn).addEventListener('click', function(){
            change(new reverseComplementState);
        });

        document.querySelector(StateSelectors.translateBtn).addEventListener('click', function(){
            change(new translateState);
        });

        // document.querySelector(StateSelectors.nucleotidTableBtn).addEventListener('click', function(){
        //     change(new nucleotidTableState);
        // });
    }

    return {
        init: function(){
            initEventListeners();

            change(new searchDnaState);
        },
        getAppState: getAppState,
        setCodonTable: function(codonTable){
            appState.codonTable = codonTable;
        }
    }
})();
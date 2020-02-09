// Results Module
import './results.styles.scss'
import { historyIcon, backIcon, tableIcon } from './icons'
// import { StorageController } from '../storage/storage.controller'
import { StateController } from '../states/states.controller'


export const ResultsController = (function(){

    let workingTasks = [];
    const handlers = {};
    const finalResults = [];
    let currentResultId;
    let showingResults = false;
    let showingTable = false;

    // Function to execute only the last call of a series of calls in a certain amount of time
    function debounce(func, threshold, execAsap) {
        let timeout;
        return function debounced() {
            let obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null; 
            };
    
            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);
    
            timeout = setTimeout(delayed, threshold || 100); 
        };
    }

    // Handler for worker results
    function handler(identifier){
        const results = [];
        const handlerIdentifier = identifier;

        const deb = debounce(function(){
            // Add final result to Controller
            let finalResult = {};
            finalResult[handlerIdentifier] = results;
            addFinalResult(finalResult);
            
            // Remove handler and working task
            workingTasks = workingTasks.filter(task => task !== handlerIdentifier);
            delete handlers[handlerIdentifier];
        }, 100);

        return function handle(dataReceived){
            results.push(dataReceived);
            deb.call();
        }
    }

    // Create or call handler for worker results
    function handleResults(data){
        const identifier = data.identifier; // Integer Identifier generates Array-Like object
        if(workingTasks.indexOf(identifier) < 0){
            // Push task to working
            workingTasks.push(identifier);

            // Creates handler for the task
            handlers[identifier] = handler(identifier);

            // Call handler passing the worker results
            handlers[identifier](data, identifier);
        }else{ 
            // Already Working!! Call handler passing the worker results
            handlers[identifier](data, identifier);
        }
    }

    // Show Results Modal
    function showResults(e){
        const historyBtn = document.querySelector('.history-btn');
        if(showingResults){
            historyBtn.innerHTML = historyIcon;
            document.querySelector('.results').classList.add('hideResults');
            setTimeout(() => {
                document.querySelector('.results').style.display = 'none';
            }, 400); // Hide animation duration
            showingResults = false;
        }else{
            historyBtn.innerHTML = backIcon;
            document.querySelector('.results').classList.remove('hideResults');
            document.querySelector('.results').style.display = 'flex';
            showingResults = true;
            reloadRsults();
        }
    }

    // Show Codon Table
    function showTable(e){
        const codonTableBtn = document.querySelector('.codon-table-btn');
        if(showingTable){
            codonTableBtn.innerHTML = tableIcon;
            document.querySelector('.codon-table').classList.add('hideTable');
            setTimeout(() => {
                document.querySelector('.codon-table').style.display = 'none';
            }, 400); // Hide animation duration
            showingTable = false;
            setCodonTable();
        }else{
            codonTableBtn.innerHTML = backIcon;
            document.querySelector('.codon-table').classList.remove('hideTable');
            document.querySelector('.codon-table').style.display = 'block';
            showingTable = true;
            reoladTable();
        }
    }

    function addFinalResult(finalResult){
        // const finalResults = StorageController.get('finalResults');

        if(finalResults.length > 9){
            finalResults.pop()
        }
        finalResults.unshift(finalResult);

        // StorageController.set('finalResults', finalResults);
        reloadRsults();
    }

    function reloadRsults(){
        // const finalResults = StorageController.get('finalResults');
        const lastResultsDiv = document.querySelector('.last-results');
        while(lastResultsDiv.firstChild){
            lastResultsDiv.removeChild(lastResultsDiv.firstChild);
        }

        if(finalResults.length){
            // Append each result
            finalResults.forEach(result => {
                // Object.entries returs => [key, value]
                let [resultId, resultContent] = Object.entries(result)[0];

                // Create result li
                let resultItem = document.createElement('div');
                resultItem.setAttribute('identifier', resultId);
                resultItem.className = 'result-item';
                resultItem.innerHTML = `
                   ${resultContent[0].source} ${getState(resultContent[0].state)} ${getDate(new Date(parseInt(resultId)))}
                `;

                lastResultsDiv.appendChild(resultItem);
            });
        }else{
            const noLastResults = document.createElement('div');
            noLastResults.className = 'no-last-results';
            noLastResults.appendChild(document.createTextNode("No results yet"));
            lastResultsDiv.appendChild(noLastResults);
        }
    }

    function reoladTable(){
        const appState = StateController.getAppState();
        for(let aminoacid in appState.codonTable){
            let tableInput = document.querySelector(`[aminoacid=${aminoacid}]`).firstChild;
            tableInput.value = appState.codonTable[aminoacid].join(', ');
        }
    }

    function setCodonTable(){
        const appState = StateController.getAppState();
        for(let aminoacid in appState.codonTable){
            let tableInput = document.querySelector(`[aminoacid=${aminoacid}]`).firstChild;
            appState.codonTable[aminoacid] = tableInput.value.replace(/\s/g, '').replace(/,$/, '').split(',');
        }
        StateController.setCodonTable(appState.codonTable);
    }

    function codonsRegex(e){
        if(e.code !== 'Backspace'){
            e.target.value = e.target.value.replace(/(\w{3})[,]?/g, "$1,").toUpperCase();
        }
    }

    // Show Selected Result
    function showResult(e){
        // const finalResults = StorageController.get('finalResults');
        if(e.target.classList.contains('result-item')){
            const resultItem = e.target;
            const identifier = resultItem.getAttribute('identifier');
            const results = finalResults.find(res => res[identifier])[identifier];
            const state = results[0].state;
            currentResultId = identifier;

            // Clear last current result
            const lastCurrentResult = document.querySelector('.current-result');
            if(lastCurrentResult){
                lastCurrentResult.classList.remove('current-result');
            }
            resultItem.classList.add('current-result');
            
            const resultDiv = document.querySelector('.result');
            while(resultDiv.firstChild){
                resultDiv.removeChild(resultDiv.firstChild);
            }

            // Create Result State title
            const resultTitle = document.createElement('div');
            resultTitle.className = 'result-title';
            
            const pdfButton = document.createElement('button');
            pdfButton.textContent = 'Download TXT';
            pdfButton.className = 'txt-button';

            const fastaButton = document.createElement('button');
            fastaButton.textContent = 'Download Fasta';
            fastaButton.className = 'fasta-button';

            // Create Result body
            const resultBody = document.createElement('div');
            resultBody.className = 'result-body';

            // Show only 10 relevant results on screen
            let relevantResults = 0;
            for(let result of results) {
                if(result.result.length || state === 'translate'){
                    let resultContent = getResultView(state, result);

                    resultBody.appendChild(resultContent);
                    relevantResults++;
                }
                if(relevantResults > 9) break;
            };
            if(relevantResults === 0) {
                resultBody.innerHTML = `
                    <span style="
                        margin-top: 2em;
                        display: block;
                        text-align: center;
                    ">NO RESULTS FOUND</span>
                `;

                // Append Only State name to title
                resultTitle.appendChild(document.createTextNode(getState(state)));                
            } else{
                // Append Download buttons to tile for more results info
                resultTitle.appendChild(pdfButton);
                resultTitle.appendChild(document.createTextNode(getState(state)));
                resultTitle.appendChild(fastaButton);
            }
            resultDiv.appendChild(resultTitle);
            resultDiv.appendChild(resultBody);
        }
    }

    function downloadButtons(e){
        if(e.target.classList.contains('txt-button')){
            downloadTxt();
        }
        if(e.target.classList.contains('fasta-button')){
            downloadFasta();
        }
    }

    function downloadTxt(){
        const currentResultIndex = finalResults.findIndex(res => res[currentResultId]);
        const state = finalResults[currentResultIndex][currentResultId][0].state;
        let data = '';

        for(let result of finalResults[currentResultIndex][currentResultId]) {
            if(result.result.length || state === 'translate'){
                data += getResultTxt(state, result);
            }
        };

        download(data, `${state}.txt`, 'text/plain;charset=utf-8');
    }

    function downloadFasta(){
        const currentResultIndex = finalResults.findIndex(res => res[currentResultId]);
        const state = finalResults[currentResultIndex][currentResultId][0].state;
        let data = '';

        for(let result of finalResults[currentResultIndex][currentResultId]) {
            if(result.result.length || state === 'translate'){
                data += getResultFasta(state, result);
            }
        };

        download(data, `${state}.fasta`, 'text/plain;charset=utf-8');
    }

    function download(data, filename, type) {
        let file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            let a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }

    function getState(stateId){
        switch(stateId){
            case "searchDna":
                return 'DNA Search'
            case "searchProtein":
                return 'Protein Search'
            case "translate":
                return 'Translation'
            case "reverseComplement":
                return 'Reverse Complement'
            case "searchProteinDna":
                return 'Protein DNA Search'
        }
    }

    function getResultView(resultState, content){
        let resultContent = document.createElement('div');
        resultContent.className = 'result-content';
        let { result, state, sequenceId, identifier } = content;
        let frame;

        // Create result sequence id title
        let resultSequenceId = document.createElement('span');
        resultSequenceId.className = 'result-sequence-id';
        resultSequenceId.appendChild(document.createTextNode(sequenceId));

        // Create result details
        let resultDetails = document.createElement('div');
        resultDetails.className = 'result-details';

        switch(resultState){
            case "searchDna":
            case "searchProtein":
                result.forEach(match => {
                    // Match info
                    let matchText = match[0];
                    let matchIndex = match.index;
                    let matchInput = match.input;

                    // Create match content to display and highlight the match
                    let matchContent = document.createElement('div');
                    matchContent.appendChild(document.createTextNode(`Match at position ${matchIndex+1}: ${matchInput.slice(0, matchIndex)}`));

                    // Highlight match and append
                    let matchHighlight = document.createElement('strong');
                    matchHighlight.style.color = '#2a2e65';
                    matchHighlight.style.fontSize = '20px';
                    matchHighlight.appendChild(document.createTextNode(matchText));
                    matchContent.appendChild(matchHighlight);

                    // Append after match text
                    matchContent.appendChild(document.createTextNode(`${matchInput.slice(matchIndex+matchText.length, matchInput.length)}`));

                    resultDetails.appendChild(matchContent);
                    resultDetails.appendChild(document.createElement('br'));
                    resultDetails.appendChild(document.createElement('br'));
                });

                break;
                
            case "searchProteinDna":
                for(frame in result){
                    if(frame === 'length') continue;
                    result[frame].forEach(match => {
                        // Match info
                        let matchText = match[0];
                        let matchIndex = match.index;
                        let matchInput = match.input;
    
                        // Create match content to display and highlight the match
                        let matchContent = document.createElement('div');
                        matchContent.appendChild(document.createTextNode(`Match at ${frame} position ${matchIndex+1}: ${matchInput.slice(0, matchIndex)}`));
    
                        // Highlight match and append
                        let matchHighlight = document.createElement('strong');
                        matchHighlight.style.color = '#2a2e65';
                        matchHighlight.style.fontSize = '20px';
                        matchHighlight.appendChild(document.createTextNode(matchText));
                        matchContent.appendChild(matchHighlight);
    
                        // Append after match text
                        matchContent.appendChild(document.createTextNode(`${matchInput.slice(matchIndex+matchText.length, matchInput.length)}`));
    
                        resultDetails.appendChild(matchContent);
                        resultDetails.appendChild(document.createElement('br'));
                        resultDetails.appendChild(document.createElement('br'));
                    });
                }

                break;

            case "translate":
                for(frame in result){
                    resultDetails.appendChild(document.createTextNode(`${frame}: ${result[frame]}`));
                    resultDetails.appendChild(document.createElement('br'));
                    resultDetails.appendChild(document.createElement('br'));
                }

                break;

            case "reverseComplement":
                // Set details content
                resultDetails.appendChild(document.createTextNode(result));
                
                break;
        }
        
        // Append sequence id
        resultContent.appendChild(resultSequenceId);
            
        // Append result Details
        resultContent.appendChild(resultDetails);

        return resultContent;
    }

    function getResultFasta(resultState, content){
        let { result, state, sequenceId, identifier } = content;
        let frame;
        let res = '';

        switch(resultState){
            case "searchDna":
            case "searchProtein":
                res += `>${sequenceId}\n${result[0].input}\n\n`
                break;
                
            case "searchProteinDna":
                for(frame in result){
                    if(frame === 'length') continue;
                    res += `>${frame} ${sequenceId}\n${result[frame][0].input}\n\n`                    
                }
                break;

            case "translate":
                for(frame in result){
                    res += `>${frame} ${sequenceId}\n${result[frame]}\n\n`;
                }
                break;

            case "reverseComplement":
                res += `>${sequenceId}\n${result}\n\n`
                break;
        }

        return res;
    }

    function getResultTxt(resultState, content){
        let { result, state, sequenceId, identifier } = content;
        let frame;
        let res = '';

        switch(resultState){
            case "searchDna":
            case "searchProtein":
                res += `### ${sequenceId} ###\n`;
                result.forEach(match => {
                    // Match info
                    let matchText = match[0];
                    let matchIndex = match.index;
                    let matchInput = match.input;

                    res += `#: Match at position ${matchIndex+1}: ${matchInput.slice(0, matchIndex)}`;

                    // Highlight match and append
                    res += `##::${matchText}::##`;

                    // Append after match text
                    res += `${matchInput.slice(matchIndex+matchText.length, matchInput.length)}\n\n`;
                });
                break;
                
            case "searchProteinDna":
                res += `### ${sequenceId} ###\n`;
                for(frame in result){
                    if(frame === 'length') continue;
                    result[frame].forEach(match => {
                        // Match info
                        let matchText = match[0];
                        let matchIndex = match.index;
                        let matchInput = match.input;
    
                        // Create match content to display and highlight the match
                        res +=`#: Match at ${frame} position ${matchIndex+1}: ${matchInput.slice(0, matchIndex)}`;
    
                        // Highlight match and append
                        res += `##::${matchText}::##`;
    
                        // Append after match text
                        res += `${matchInput.slice(matchIndex+matchText.length, matchInput.length)}\n\n`;
                    });
                }
                break;

            case "translate":
                res += `### ${sequenceId} ###\n`;
                for(frame in result){
                    res += `    ${frame}: ${result[frame]}\n\n`;
                }
                break;

            case "reverseComplement":
                res += `### ${sequenceId} ###\n${result}\n\n`
                break;
        }

        return res;
    }

    function getDate(date){
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let hours = date.getHours();
        if(hours < 10) hours = '0' + hours;

        let minutes = date.getMinutes();
        if(minutes < 10) minutes = '0' + minutes;
        
        return `${months[date.getMonth() -1]} ${date.getDate()}, ${hours}:${minutes}`;
    }

    function eventListeners(){
        document.querySelector('.history-btn').addEventListener('click', showResults);
        document.querySelector('.codon-table-btn').addEventListener('click', showTable);
        document.querySelector('.last-results').addEventListener('click', showResult);
        document.querySelector('.result').addEventListener('click', downloadButtons);

        const appState = StateController.getAppState();
        for(let aminoacid in appState.codonTable){
            let tableInput = document.querySelector(`[aminoacid=${aminoacid}]`).firstChild;
            tableInput.addEventListener('keyup', codonsRegex);
        }
    }

    return {
        init: function(){
            eventListeners();
        },
        handleResults: handleResults
    }
})();
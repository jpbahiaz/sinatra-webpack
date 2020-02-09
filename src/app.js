import './shared-styles.scss'
import { StateController } from './states/states.controller'
import { ResultsController } from './results/results.controller'
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import registerEvents from 'serviceworker-webpack-plugin/lib/browser/registerEvents'

import './background.jpg'
import './history-solid.svg'

const App = (function(modules){
    const { StateController, ResultsController } = modules;

    function eventListeners(){
        // Run Current State Action on Submit
        document.querySelector('.upload-form').addEventListener('submit', runStateAction);

        // Change button text to the chosen file name
        document.querySelector('#file-input').addEventListener('change', function(){
            if(this.value){
                const fileName = this.value.match(/.*[\/\\](.*)/)[1]
                document.querySelector('.file-label').textContent = fileName;
            } else {
                document.querySelector('.file-label').textContent = 'Choose File';
            }
        });
    }
    
    function runStateAction(e){
        e.preventDefault();
        if(validateState()){
            const appState = StateController.getAppState();
            appState.currentState.action();

            const fileInput = document.querySelector('.file-submit');
            fileInput.classList.add('submited');
            fileInput.textContent = 'Submited!';
            fileInput.value = 'Submited!';

            const historyBtn = document.querySelector('.history-btn');
            historyBtn.classList.remove('jump');
            setTimeout(function(){
                historyBtn.classList.remove('jump');
                historyBtn.classList.add('jump');
                fileInput.classList.remove('submited');
                fileInput.textContent = 'Submit';
                fileInput.value = 'Submit';
            }, 2000);
        }else{
            console.log('Not Validated');
        }

        // Clear File Input
        document.querySelector('#file-input').value = '';
        document.querySelector('.file-label').textContent = 'Choose File';
    }

    function validateState(){
        const appState = StateController.getAppState();
        if(!appState.content.text && !appState.content.file){
            const fileLabel = document.querySelector('.file-label');
            const fileLabelColor = fileLabel.style.backgroundColor;
            const textInput = document.querySelector('.text-input');
            const textInputPlaceholder = textInput.getAttribute('placeholder');
            textInput.style.boxShadow = '0 2px 10px 2px red';
            textInput.setAttribute('placeholder', 'You must insert something!!!!');
            fileLabel.style.backgroundColor = 'red';
            setTimeout(function(){
            fileLabel.style.backgroundColor = fileLabelColor;
                textInput.style.boxShadow = '';
                textInput.setAttribute('placeholder', textInputPlaceholder);
            }, 3000);
            return false;
        }
        
        const pattern = document.querySelector('.pattern');
        if(pattern && pattern.value.replace(/\s/g, '') === ''){
            const patternPlaceholder = pattern.getAttribute('placeholder');
            pattern.style.boxShadow = '0 2px 10px 2px red';
            pattern.setAttribute('placeholder', 'You must insert something!!!!');
            setTimeout(function(){
                pattern.style.boxShadow = '';
                pattern.setAttribute('placeholder', patternPlaceholder);
            }, 3000);
            return false;
        }



        return true;
    }

    function installSw(){
        if ('serviceWorker' in navigator) {
            const registration = runtime.register()
        
            registerEvents(registration, {
                onInstalled: () => {
                console.log('onInstalled')
                },
                onUpdateReady: () => {
                console.log('onUpdateReady')
                },
        
                onUpdating: () => {
                console.log('onUpdating')
                },
                onUpdateFailed: () => {
                console.log('onUpdateFailed')
                },
                onUpdated: () => {
                console.log('onUpdated')
                },
            })
        } else {
            console.log('serviceWorker not available')
        }
    }

    return {
        init: function(){
            installSw();
            StateController.init();
            ResultsController.init();
            eventListeners();

            // Show content only after everything is loaded
            document.addEventListener('DOMContentLoaded', function(){
                document.querySelector('.app').style.display = 'flex';
            });
        }
    }
})({
    StateController,
    ResultsController
});

App.init();
import './upload.styles.scss'
import { StateController } from '../states/states.controller'

export const UploadController = (function(){

    function initLoaders(){
        // document.querySelector('.upload-form').addEventListener('submit', getUploadResponse);

        document.querySelector('#file-input').addEventListener('change', function(){
            // Change button text to the chosen file name
            const fileName = this.value.match(/.*[\/\\](.*)/)[1]
            document.querySelector('.file-label').textContent = fileName;
        });
    }

    function getUploadResponse(e){
        e.preventDefault();
        const textInput = document.querySelector('.text-input');

        // Store reference to form to make later code easier to read
        const formData = new FormData(e.target);
        formData.append('sequence', textInput.value);
        const currentState = StateController.getAppState();
        console.log(formData);
        console.log(currentState);
        // // Post data using the Fetch API
        fetch(currentState.route, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => console.log(data));
    }


    return {
        init: function(){
            console.log('Upload init');
            initLoaders();
        }
    };
})();

// UploadController.init();
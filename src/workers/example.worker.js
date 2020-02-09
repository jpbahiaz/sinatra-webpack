// Web worker
import { ExampleService } from '../services/example.service'

self.addEventListener('message', function(e){
	// You can use web workers to do tasks that
	// could make the main thread struggle providing
	// a fluid UX to the user always

	// Big calculations and complex code here... Ex: 
	for (let index = 0; index < 1000000; index++) {}
});
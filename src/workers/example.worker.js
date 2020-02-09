// Web worker
import { ExampleService } from '../services/example.service'

self.addEventListener('message', function(e){
	// You can use web workers to do tasks that
	// could make the main thread struggle providing
	// a fluid UX to the user always

	// Big calculations and complex code here... Ex: 
	this.console.group('Calculation')
	for (let index = 0; index < 5000; index++) {
		console.log("Calculating....",)
	}
	this.console.groupEnd('Calculation')
	console.log(`Hi from Example Worker! Here is your data:`, e.data)
});
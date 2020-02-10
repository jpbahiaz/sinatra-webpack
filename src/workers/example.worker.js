// Web worker
import { ExampleService } from '../services/example.service' // you can call services from here

self.addEventListener('message', function(e){
	// You can use web workers to do tasks that
	// could make the main thread struggle providing
	// a fluid UX to the user always

	// Big calculations and complex code here... Ex: 
	console.group('Calculation')
	for (let index = 0; index < 5000; index++) {
		console.log("Calculating....",)
	}
	console.groupEnd()
	
	postMessage({message: 'Hi from Example Worker! Here is your data', data: e.data})
	setTimeout(() => {
		postMessage({message: 'Response from worker delayed', data: e.data})
	}, 4000)

	// You can fetch data if you want...
	ExampleService.getBundleStatus((status) => {
		console.log(`Fetched bundle status: `, status)
	});
})
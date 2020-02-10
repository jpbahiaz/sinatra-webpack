
export const ExampleService = (function(){
	// Call anything you want here

	const responseStatus = response => response.status

	return {
		getBundleStatus: callback => fetch('/app.bundle.js').then(responseStatus).then(callback)
	}
})()
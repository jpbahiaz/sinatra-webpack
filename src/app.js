import { WorkersController } from './controllers/workers.controller'
import { ExampleService } from './services/example.service'
import runtime from 'serviceworker-webpack-plugin/lib/runtime'
import registerEvents from 'serviceworker-webpack-plugin/lib/browser/registerEvents'

import './shared-styles.scss'
// import './background.jpg' -> Remember to import images and css in any file that webpack bundles

const App = (function () {
	function eventListeners() {
		console.log('eventListeners')
	}

	function installSw() {
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
		init: function () {
			installSw()
			eventListeners()
			WorkersController.init()

			WorkersController.sendData({
				prop: "Hi worker"
			})

			WorkersController.addListener((message) => {
				console.log(message.data)
			})

			// Show content only after everything is loaded
			document.addEventListener('DOMContentLoaded', () => {
				document.querySelector('.app').style.display = 'flex'
			})
		}
	}
})()

App.init()
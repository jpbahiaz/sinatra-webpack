# Sinatra Webpack Example App

This app uses [Sinatra](http://sinatra-org-book.herokuapp.com/) and [Webpack](https://webpack.js.org/guides/)
to create a simple pure JS single page application. It uses [Module Pattern](https://dev.to/tomekbuszewski/module-pattern-in-javascript-56jm) to describe controllers that encapsulates application logic and functionality. For more information about Service and Web workers check these links from MDN:
- [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)

## Instalation
Just run ```npm install``` and ```bundle install``` on your console. Make sure you have **NodeJs 10+** and **Ruby 2.5+** installed. If that's not the case here is some links that can help:
- [Install Ruby](https://www.ruby-lang.org/en/documentation/installation/)
- [Install NodeJs](https://nodejs.org/en/)
- [Install npm](https://www.npmjs.com/get-npm)

## Run
- For development: ```npm run dev```
- For production: ```npm run build && bundle exec ruby app.rb```

## Depedencies
All packages needed to load and bundle your app to a single
file.
```javascript
{
	"@babel/core": "",
	"@babel/preset-env": "",
	"babel-loader": "",
	"clean-webpack-plugin": "",
	"css-loader": "",
	"file-loader": "",
	"html-webpack-plugin": "",
	"node-sass": "",
	"sass-loader": "",
	"serviceworker-webpack-plugin": "",
	"style-loader": "",
	"webpack": "",
	"webpack-cli": "",
	"webpack-dev-server": "",
	"webpack-merge": "",
	"worker-loader": "",
}
 ```
- **Babel:** Let you use all the beautiful JS features
- **Clean Webpack Plugin:** Make sure to wipe ```/dist``` folder before bundling
- **Css, Style and Sass Loaders:** Helps bundling ```/.s?css/``` files
- **File Loader:** Helps webpack to link your fonts and images to your code
- **HTML Plugin:** Inserts your index.html template to the final bundle
- **Service Worker Plugin:** Assure that the ```sw.js``` file bundles separately and in the apps root so that the browser can register your Service Worker
- **Webpack...:** Packages to provide webpack functionality
- **Worker Loader:** Exposes web workers to the code and tells the browser to treat ```/.worker.js/``` files as Workers

## Deploy
You can deploy this app easily on [Heroku](https://www.heroku.com). Create an account and a [new app](https://dashboard.heroku.com/new-app). After creation follow the instruction on the Deploy tab. Make sure to check on the settings section if you have heroku/nodejs added to your Buildpacks.

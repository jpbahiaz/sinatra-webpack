# Sinatra Webpack Example App

This app uses [Sinatra](http://sinatra-org-book.herokuapp.com/) and [Webpack](https://webpack.js.org/guides/)
to create a simple pure JS single page application. It uses [Module Pattern](https://dev.to/tomekbuszewski/module-pattern-in-javascript-56jm) to describe controllers that encapsulates application logic and functionality.

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
	"@babel/core": "^7.8.4",
	"@babel/preset-env": "^7.8.4",
	"babel-loader": "^8.0.6",
	"clean-webpack-plugin": "^3.0.0",
	"css-loader": "^3.4.2",
	"file-loader": "^4.3.0",
	"html-webpack-plugin": "^3.2.0",
	"node-sass": "^4.13.1",
	"sass-loader": "^7.3.1",
	"serviceworker-webpack-plugin": "^1.0.1",
	"style-loader": "^1.1.3",
	"webpack": "^4.41.5",
	"webpack-cli": "^3.3.10",
	"webpack-dev-server": "^3.10.3",
	"webpack-merge": "^4.2.2",
	"worker-loader": "^2.0.0"
}
 ```
- **Babel:** Let you use all the beautiful JS features we know.
- **Clean Webpack Plugin:** Make sure to wipe dist before bundling
- **Css, Style and Sass Loaders:** Helps bundling ```/.s?css/``` files
- **File Loader:** Helps webpack to link your fonts and images to your code
- **HTML Plugin:** Inserts your index.html template to the final bundle
- **Service Worker Plugin:** Assure that the ```sw.js``` file bundles separately and in the apps root so that the browser can register your Service Worker
- **Webpack...:** Packages to provide webpack functionality
- **Worker Loader:** Exposes web workers to the code and tells the browser to treat ```/.worker.js/``` files as Workers

## Deploy
You can deploy this app easily on [Heroku](https://www.heroku.com). Create an account and a [new app](https://dashboard.heroku.com/new-app). After creation follow the instruction on the Deploy tab. Make sure to check on the settings section if you have heroku/nodejs added to your Buildpacks.
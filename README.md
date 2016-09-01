FUTURECORP BOILERPLATE (Simple)
==============================


FutureCorp Boilerplate (Simple branch) using [Gulp](http://gulpjs.com/) and [React](https://facebook.github.io/react/) and [Kirby CMS](https://getkirby.com/).

This branch is intended for small to medium scope projects. It includes a skeleton CMS and build-pipeline, but does not include tests, deployment or server-side rendering.


# Setup

If you've never used Node or npm before, you'll need to install Node (works with v6.2.1).
If you use homebrew, do:

```
brew install node
```

Otherwise, you can download and install from [here](http://nodejs.org/download/).

### Install npm dependencies
```
npm install
```

### Clone and cd into the root
```
cd path/to/Repo
```

### Start
```
npm start
```



# Build Pipeline
The build-pipeline uses [Gulp](http://gulpjs.com/), and includes the following:

* [Babelify](https://github.com/babel/babelify)
* [Browserify](http://browserify.org/)
* [SASS](http://sass-lang.com/)
* [Autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)
* [BrowserSync](https://www.browsersync.io/)


### Commands
For a full list of commands, see `package.js`.

* `npm start`
  * Watches JS and SCSS files in the app directory
  * Starts a PHP server on 127.0.0.1:4000
  * Starts BrowserSync with Live-reloading on localhost:3000
  * Enables source-maps
  * Compiles code to `build/assets`
* `npm build`
  * Compiles code to `build/assets`
  * Minifies CSS and JS



# CMS
This boilerplate uses [Kirby CMS](https://getkirby.com/), adapted to output JSON.

Generally, the workflow is the same as described in the [Kirby Documentation](https://getkirby.com/docs), but there are a few differences.

* As routing and templating is client-side, any url will return the home template, which simply includes skeleton HTML, CSS and the JavaScript entrypoint.
* Routes matching `api/[slug-here]` will return the page.
* Page templates (other than home) should be written to return a JSON response.



# React
This boilerplate uses [React](https://getkirby.com/) with [React Router](https://github.com/reactjs/react-router).

* Routes are defined in `app/routes.js`.
* UI lives in `app/ui`.

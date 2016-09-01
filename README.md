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


# How to edit the fields in the CMS and API JSON output
* The structure of the template fields can be edited in `build/site/blueprints/page-type-here.yml`. (This configures the fields which store in the CMS and which are stored in the content for the page)
* It's a single page site — the only template which will be returned (for any route, excluding routes prepended with `api/`) is `build/site/templates/home.php`.
* The homepage will render including the CSS and JS (look in `build/site/snippets/header.php` or `build/site/snippets/footer.php`). It will also store the Site-wide data, Tour Dates, and Initial collection (usually the default collection, unless the user visits through a deep-link). The slug of the initial collection is also stored. These will be on the window object. Look at `build/site/templates/home.php`.
* If you need to edit the JSON output for a collection, it's in `build/site/templates/collection.php`.
* If you need to edit the JSON output for tour dates, it's in `build/site/templates/tour-dates.php`.
* If you need to check out the custom routes code, it's in `build/site/config/config.php`.
* Kirby documentation about the 'blueprints' (CMS structure) is here > [Blurprints Documentation](https://getkirby.com/docs/panel/blueprints)
* Kirby documentation about the routing is here > [Routing Documentation](https://getkirby.com/docs/developer-guide/advanced/routing)
* Kirby cheatsheet is here > [Kirby Cheatsheet](https://getkirby.com/docs/cheatsheet)




# React
This boilerplate uses [React](https://getkirby.com/) with [React Router](https://github.com/reactjs/react-router).

* Routes are defined in `app/routes.js`.
* UI lives in `app/ui`.

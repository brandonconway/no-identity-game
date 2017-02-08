/**
 * Build config for dependencies
 */
(function (global) {
	System.config({
	baseURL: "/",
    paths: {
      // paths serve as alias
      'npm:*': './node_modules/*'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
	  app: './app',
      // other libraries
	  'plugin-babel': 'npm:systemjs-plugin-babel/plugin-babel.js',
	  'systemjs-babel-build': 'npm:systemjs-plugin-babel/systemjs-babel-browser.js'
	},
	transpiler: 'plugin-babel',
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
    }
  });
})(this);

/**
 * Each item in the exported array is an object.
 * 
 * Each object must have a name property and either a deps or a files property.
 * 
 * name is the resulting filename of the bundle (sans the .js extension).
 * 
 * deps is an array of third-party dependencies (files we don't want to process with Babel).
 * 
 * files are self-authored files that will be compiled with Babel.
 * 
 * .js extension is assumed throughout and never used.
 * 
 * The tilde (~) is a shorthand for looking into the node_modules directory. Otherwise, all paths
 * are considered relative to the src directory.
 * 
 * @see https://cobwwweb.com/compile-es6-code-gulp-babel-part-3
 */

module.exports = [
  {
    name: 'main',
    deps: [
      '~jquery/dist/jquery.min',
      'vendor/my-lib'
    ],
    files: [
      'components/foo',
      'components/bar'
    ]
  },
  {
    name: 'lodash',
    deps: [
      '~lodash/lodash'
    ]
  }
]
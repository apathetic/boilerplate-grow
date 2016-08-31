import buble from 'rollup-plugin-buble';              // quicker, simpler babel
import resolve from 'rollup-plugin-node-resolve';     // lets us fetch ES6 bundles from node_modules
import uglify from 'rollup-plugin-uglify';            //

export default {
  entry: `source/js/main.js`,
  dest: `dist/js/main.js`,
  format: 'iife',
  plugins: [
    resolve({                                         // this allows us to pull in other modules as ES6 bundles
      jsnext: true,                                   // Look for ES6 first
      main: true,                                     // ... also look for commonJS if no ES6
      browser: false                                  // ... some package.json files have a "browser" field which specifies alternative files to load for people bundling for the browser
    }),
    buble(),
    // uglify()
  ]
};

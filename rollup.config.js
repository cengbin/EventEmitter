const terser = require('@rollup/plugin-terser')
const {babel} = require("@rollup/plugin-babel")

module.exports = {
  input: 'index.js',
  output: [
    {
      file: 'dist/EventEmitter.js',
      format: 'umd',
      name: 'EventEmitter',
    },
    {
      file: 'dist/EventEmitter.min.js',
      format: 'umd',
      name: 'EventEmitter',
      plugins: [terser()]
    },
  ],
  plugins: [
    babel({
      babelHelpers: "bundled",
      exclude: /node_modules/
    })
  ]
}

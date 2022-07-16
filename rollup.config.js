import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/main.js',
  output: {
    format: 'esm',
    file: 'bundle.js'
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: false
      }
    }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs()
  ]
}

import * as fs from 'fs';
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'js/src/shows.js',
  output: {
    file: 'js/public/shows.js',
    format: 'iife'
  },
  plugins: [
    svelte({
      include: 'js/src/components/**/*.svelte',
      emitCss: true,
      css: function (css) {
        css.write('css/public/main.css');
      },
    }),
    resolve(),
  ]
}
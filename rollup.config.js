import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/index.js',
  dest: 'lib/storage.js',
  moduleName: 'Storage',
  format: 'umd',
  plugins: [
    nodeResolve({
      jsnext: true,
      browser: true,
    }),
    commonjs(),
    buble()
  ]
};

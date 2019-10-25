import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import glob from 'glob';

const files = new Set();

glob.sync('src/calculator/*.js').forEach(filePath => {
  // Jump 'src' and 'calculator'
  const fileName = filePath.split('/')[2];

  if (fileName) {
    files.add({ name: fileName, path: './src/calculator' });
  }
});

glob.sync('src/utils/calculator/*.js').forEach(filePath => {
  // Jump 'src' and 'utils' and 'calculator'
  const utilsName = filePath.split('/')[3];

  if (utilsName) {
    files.add({ name: utilsName, path: './src/utils/calculator' });
  }
});

function onwarn(warning) {
  if (warning.message.indexOf("'react' but never used") > -1) {
    return;
  }

  throw Error(warning.message);
}

export default Array.from(files).reduce((acc, file) => {
  return [
    ...acc,
    {
      onwarn,
      input: `${file.path}/${file.name}`,
      output: {
        file: `./build/${file.name}`,
        format: 'cjs',
        interop: false,
        exports: 'named',
      },
      plugins: [
        resolve(),
        commonjs(),
        babel({
          exclude: /node_modules/,
          configFile: './babel.config.js',
        }),
        sizeSnapshot(),
      ],
    },
  ];
}, []);

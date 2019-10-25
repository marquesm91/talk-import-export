module.exports = function(api) {
  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['>0.01%', 'not op_mini all'],
        },
        exclude: ['transform-async-to-generator', 'transform-regenerator'],
        loose: true,
      },
    ],
    '@babel/preset-react',
  ];

  const plugins = [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
    '@babel/plugin-transform-object-assign',
    '@babel/plugin-transform-react-constant-elements',
    '@babel/plugin-transform-react-inline-elements',
    [
      'babel-plugin-transform-react-remove-prop-types',
      {
        mode: 'remove',
        removeImport: true,
      },
    ],
  ];

  if (!api.env('test')) {
    plugins.push([
      'babel-plugin-react-remove-properties',
      { properties: ['data-testid'] },
    ]);
  }

  return {
    presets,
    plugins,
    ignore: [/@babel[\\|/]runtime/],
  };
};

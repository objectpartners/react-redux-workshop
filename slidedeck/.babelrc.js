module.exports = {
  presets: [
    [
      'babel-preset-env',
      {
        targets: {
          browsers: ['>1%', 'not ie 11', 'not op_mini']
        }
      }
    ],
    'babel-preset-react'
  ]
};

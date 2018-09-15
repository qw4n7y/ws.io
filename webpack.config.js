const webpack = require('webpack')

const resolvePath = relativePath => require('path').resolve(__dirname, relativePath)

module.exports = env => {
  return {
    mode: 'production',
    devtool: 'source-map',
    
    entry: {
      socket: [
        resolvePath('./src/index.ts')
      ],
    },
    
    resolve: {
      extensions: ['.ts', '.js']
    },
    
    plugins: [],
    
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'ts-loader',
          }
        },
      ],
    },

    output: {
      filename: '[name].js',
      path: resolvePath('./build')
    },
  }
}
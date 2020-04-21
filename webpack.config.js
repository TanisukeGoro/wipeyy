const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

module.exports = function(webpackEnv, options) {
  const isEnvDevelopment = options.mode === 'development';
  const isEnvProduction = options.mode === 'production';
  const outputPath = isEnvProduction ? __dirname + '/dist' : __dirname + '/dev'
  
  return {
    // モードの設定、v4系以降はmodeを指定しないと、webpack実行時に警告が出る
    mode: 'development',
    // エントリーポイントの設定
    entry: {
      popup: ['./src/popup.js'],             // メイン部分はここに記載
      contents: ['./src/contents.js'],        // contents script はここに記載
      background: ['./src/background.js'],  // background はここに記載
    },
    output: {
      // The build folder.
      // path: isEnvProduction ? paths.appBuild : undefined,
      // path: isEnvProduction ? __dirname + '/dist' : __dirname + '/dev',
      // filename: isEnvProduction
      //   ? '[name].js'
      //   : isEnvDevelopment && '[name].js',

      filename: '[name].js',
      path: outputPath,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin([
        { 
          from: './src/_locales',
          to: outputPath + "/_locales",
        }
      ]),
      new CopyWebpackPlugin([
        { 
          from: './src/icon',
          to: outputPath + "/icon",
        }
      ]),
      new CopyWebpackPlugin([
        { 
          context: "src",
            from: "**/*.html",
            to: outputPath
        }
      ]),
      new CopyWebpackPlugin([
        { 
          context: "src",
            from: "**/manifest.json",
            to: outputPath
        }
      ]),
    ]
  }
};
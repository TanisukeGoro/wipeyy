const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function(webpackEnv, options) {
    const isEnvProduction = options.mode === 'production';
    const outputPath = isEnvProduction ? path.resolve(__dirname, 'dist') : path.resolve(__dirname, 'dev');

    console.log(outputPath);

    return {
        // モードの設定
        mode: isEnvProduction ? 'production' : 'development',
        // エントリーポイントの設定
        entry: {
            popup: './src/popup.jsx', // React用にjsxに変更
            contents: './src/contents.js',
            background: './src/background.js',
        },
        output: {
            filename: '[name].js',
            path: outputPath,
            clean: true, // 出力ディレクトリをビルド前にクリーンアップ
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader', 'postcss-loader'],
                },
            ],
        },
        resolve: {
            extensions: ['.js', '.jsx'], // .jsxファイルも解決できるように
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: './src/_locales',
                        to: '_locales',
                    },
                    {
                        from: './src/icon',
                        to: 'icon',
                    },
                    {
                        from: '**/*.html',
                        to: '[name][ext]',
                        context: 'src',
                    },
                    {
                        from: '**/manifest.json',
                        to: '[name][ext]',
                        context: 'src',
                    },
                ],
            }),
        ],
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist'),
            },
            compress: true,
            port: 3000,
        },
    };
};

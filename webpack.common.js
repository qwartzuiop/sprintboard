const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        main: './src/main.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.html'),
            inject: true,
            chunks: ['main'],
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].[contenthash].js',
        chunkFilename: '[id].[chunkhash].js',
        clean: true,
        publicPath: './',
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
};
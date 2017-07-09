var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');
var entries = require('./dal/entryGetter.js').production;

var productionConfig = [{
    entry: entries,
    output: {
        filename: './[name]/bundle.js',
        path: path.resolve(__dirname, './public/'),
        publicPath: '/'
    },
    module: {
        loaders: [{
            test: /\.(png|jpg)$/,
            loader: 'url?limit=8192&context=client&name=[path][name].[ext]'
        }, {
            test: /\.less$/,
            use: [
                'style-loader',
                'css-loader',
                'less-loader'
            ]
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.scss$/,
            loader: 'style!css?sourceMap!resolve-url!sass?sourceMap'
        }, {
			test: /\.js|jsx$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
		}]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false, // false禁止uglify代码检测警告
            },
        }),
        new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
        new ExtractTextPlugin('./[name]/index.css'),

        new webpack.optimize.CommonsChunkPlugin({
          name: "common",
          // (the commons chunk name)

          filename: "common.js",
          // (the filename of the commons chunk)

          // minChunks: 3,
          // (Modules must be shared between 3 entries)

          // chunks: ["pageA", "pageB"],
          // (Only use these entries)
        })

    ]
}];
module.exports = productionConfig;
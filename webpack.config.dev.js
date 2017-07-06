const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const entries = require('./dal/entryGetter.js').dev;
// var nodeExternals = require('webpack-node-externals');
module.exports = {
	// devtool: 'eval-source-map',
    entry: entries,
	// entry: {
	// 	main: [
	// 		// 'webpack-dev-server/client?http://localhost:8080',
	// 		// 'webpack/hot/dev-server',
	// 		path.join(__dirname, 'app/main.js')
	// 	]
	// },
	output: {
        filename: './[name]/bundle.js',
        path: path.resolve(__dirname, './public'),
        publicPath: 'http://localhost:3000/',
        // libraryTarget: 'commonjs2'
    },
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		loaders: [{
			test: /\.js|jsx$/,
			loader: 'babel-loader',
			exclude: /node_modules/,

			// query: {                //node端的babel编译配置可以简化很多
	        //     babelrc: "false",
	        //     presets: ['react'],
	        //     plugins: [
	        //         // "transform-decorators-legacy",
	        //         // "transform-es2015-modules-commonjs" //如果不转换成require，import 'xxx.styl'会报错
	        //     ]
	        // }
		}, {
			test: /\.less$/,
			use: [
				'style-loader',
				'css-loader',
				'less-loader'
			],
			// options: {
			// 	modules: true
			// }

		}, {
			test: /\.(jpg|png)$/,
			// loader: 'url?limit=8192'
			loader: 'url',
			options: {
				limit: '8192'
			}
		}, {
			test: /\.css$/,
			// loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: 'css-loader',
				// publicPath: '/build'
			})

		}]
	},

	devServer: {
		contentBase: path.join(__dirname, "build"),
		compress: true,
		hot: true,
		port: 8080
	},

	plugins: [
		// new webpack.NoErrorsPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		// new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		// new ExtractTextPlugin('[name]-[hash].css'),
		new ExtractTextPlugin({
			filename: '[name]-[hash].css',
		}),
		new webpack.HotModuleReplacementPlugin(),
		// new webpack.optimize.DedupePlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		}),
		// new webpack.ProvidePlugin({
        //     'react': 'react',
        //     'react-dom': 'react-dom',
        //     'react-redux': 'react-redux',
        //     'redux': 'redux',
        //     'redux-thunk': 'redux-thunk',
        //     'redux-form': 'redux-form',
        //     'redux-form-website-template': 'redux-form-website-template',
        //     'superagent': 'superagent'
        // }),
	],

	// externals: [nodeExternals({ //不把node_modules中的文件打包，报错module.export error
	// 	whitelist: ['react','react-dom','react-redux','redux','redux-thunk','redux-form','superagent','babel-plugin-transform-runtime']
	// })]
};
const path = require('path');

module.exports = {
	mode: 'development',
	entry: ['@babel/polyfill', './src/jsmania.js'],
	target: ['web', 'es5'],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'jsMania.js'
	},
	performance: {
		maxEntrypointSize: 1024000,
		maxAssetSize: 1024000
	},
	module: {
		rules: [
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource'
			},
			{
				test: /\.(mp3|wav|ogg)$/,
				use: 'file-loader'
			},
			{
				test: /\.osu$/,
				use: 'raw-loader'
			}
		]
	}
};

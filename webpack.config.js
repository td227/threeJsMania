const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/jsMania.js',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'bundle.js'
	},
	performance: {
		maxEntrypointSize: 1024000,
		maxAssetSize: 1024000
	},
	devServer: {
		publicPath: '/public/',
		compress: true,
		port: 9000,
		hot: true
	}
};

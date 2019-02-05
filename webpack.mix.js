let mix = require('laravel-mix');

mix.webpackConfig({
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: Config.babel()
					}
				]
			}
		]
	}
});

mix.js('vendor/js/vabs.js', '')
	.sass('vendor/sass/vabs.sass', '');

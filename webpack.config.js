// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

const path = require('path');

module.exports = {
	entry: path.join(__dirname, 'src/index.js'),
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		compress: false,
		port: 3000
	},
	module: {
		rules: [
			{
				test: /\.lua$/,
				type: 'asset/source'
			},
			{
				test: /\.glsl$/,
				type: 'asset/source'
			},
		]
	},
	resolve: {
		fallback: {
			path: false,
			fs: false,
			child_process: false,
			crypto: false,
			url: false,
			module: false,
		},
	},
};

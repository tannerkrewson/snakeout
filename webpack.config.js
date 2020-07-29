const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const OUTPUT_DIR = path.join(__dirname, "dist");

module.exports = {
	entry: "./src/client/index.js",
	output: {
		filename: "[name].[hash].js",
		path: OUTPUT_DIR
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: "./public/index.html",
			favicon: "./public/favicon.ico"
		})
	]
};

import path from "path";
import * as webpack from "webpack";
import HtmlPlugin from "html-webpack-plugin";
import MiniCSSExtractPlugin from "mini-css-extract-plugin";

const config: webpack.Configuration = {
    entry: "./src/index.ts",
    devtool: "inline-source-map",
    mode: "development",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "..", "dist"),
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                use: "ts-loader",
                exclude: /node_modules/i,
            },
            {
                test: /\.s(?:a|c)ss$/i,
                use: [MiniCSSExtractPlugin.loader, "css-loader", "sass-loader"],
                exclude: /node_modules/i,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg|jpg|png)$/,
                use: {
                    loader: "url-loader",
                },
            },
            {
                test: /\.(glsl|vs|fs)/,
                use: {
                    loader: "ts-shader-loader",
                },
            },
        ],
    },
    plugins: [
        new HtmlPlugin({
            title: "Game",
        }),
        new MiniCSSExtractPlugin(),
        new webpack.ProgressPlugin(),
    ],
};

export default config;

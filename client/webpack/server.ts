import path from "path";
import * as webpack from "webpack";
import common from "./common";

import "webpack-dev-server";

const config: webpack.Configuration = {
    ...common,
    devServer: {
        static: {
            directory: path.join(__dirname, "..", "public"),
        },
        compress: false,
        port: 3008,
        host: "0.0.0.0",
        hot: true,
        open: false,
        allowedHosts: "all",
    },
};

export default config;

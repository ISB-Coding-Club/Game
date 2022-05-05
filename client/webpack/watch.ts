import * as webpack from "webpack";
import common from "./common";

const config: webpack.Configuration = {
    ...common,
    watch: true,
};

export default config;

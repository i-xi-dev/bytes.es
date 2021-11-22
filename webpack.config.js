import path from "node:path";

export default {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.join(process.cwd(), "dist2"),
    library: {
      type: "module",
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      }
    ],
  },
  resolve: {
    extensions: [
      ".ts",
      ".js",
    ],
  },
  experiments: {
    outputModule: true,
  },
};

import pkg from "./package.json";

// Rollup plugins
import babel from "@rollup/plugin-babel";
import eslint from "@rollup/plugin-eslint";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";
import sass from "node-sass";

// PostCSS plugins
import postcssPlugin from "rollup-plugin-postcss";
import nested from "postcss-nested";
import cssnext from "postcss-cssnext";
import cssnano from "cssnano";

import postcss from "postcss";
import precss from "precss";
import CleanCSS from "clean-css";
import autoprefixer from "autoprefixer";
import fs from "fs";

fs.readFile("src/css/charts.scss", (err, css) => {
  postcss([precss, autoprefixer])
    .process(css, { from: "src/css/charts.scss", to: "src/css/charts.css" })
    .then((result) => {
      let options = {
        level: {
          1: {
            removeQuotes: false,
          },
        },
      };
      let output = new CleanCSS(options).minify(result.css);
      let res = JSON.stringify(output.styles).replace(/"/g, "'");
      let js = `export const CSSTEXT = "${res.slice(1, -1)}";`;
      fs.writeFileSync("src/css/chartsCss.js", js, (err) => {
        if (err) throw err;
      });
    });
});

export default [
  {
    input: "src/js/index.js",
    sourcemap: true,
    output: [
      {
        file: "docs/assets/js/frappe-charts.min.js",
        format: "iife",
      },
      {
        file: pkg.browser,
        format: "umd",
      },
    ],
    name: "frappe",
    plugins: [
      postcssPlugin({
        preprocessor: (content, id) =>
          new Promise((resolve, reject) => {
            const result = sass.renderSync({ file: id });
            resolve({ code: result.css.toString() });
          }),
        extensions: [".scss"],
        plugins: [nested(), cssnext({ warnForDuplicates: false }), cssnano()],
      }),
      eslint({
        exclude: ["src/css/**"],
      }),
      babel({
        exclude: "node_modules/**",
        plugins: ["external-helpers"],
        babelHelpers: "bundled", // TODO this should probably be 'runtime'?
        // https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
      }),
      replace({
        exclude: "node_modules/**",
        ENV: JSON.stringify(process.env.NODE_ENV || "development"),
      }),
      terser(),
    ],
  },
  {
    input: "docs/assets/js/index.js",
    sourcemap: true,
    output: [
      {
        file: "docs/assets/js/index.min.js",
        format: "iife",
      },
    ],
    name: "frappe",
    plugins: [
      postcssPlugin({
        preprocessor: (content, id) =>
          new Promise((resolve, reject) => {
            const result = sass.renderSync({ file: id });
            resolve({ code: result.css.toString() });
          }),
        extensions: [".scss"],
        plugins: [nested(), cssnext({ warnForDuplicates: false }), cssnano()],
      }),
      eslint({
        exclude: ["src/css/**"],
      }),
      babel({
        exclude: "node_modules/**",
      }),
      replace({
        exclude: "node_modules/**",
        ENV: JSON.stringify(process.env.NODE_ENV || "development"),
      }),
    ],
  },
  {
    input: "src/js/chart.js",
    sourcemap: true,
    output: [
      {
        file: pkg.main,
        format: "cjs",
      },
      {
        file: pkg.module,
        format: "es",
      },
    ],
    plugins: [
      postcssPlugin({
        preprocessor: (content, id) =>
          new Promise((resolve, reject) => {
            const result = sass.renderSync({ file: id });
            resolve({ code: result.css.toString() });
          }),
        extensions: [".scss"],
        plugins: [nested(), cssnext({ warnForDuplicates: false }), cssnano()],
      }),
      eslint({
        exclude: ["src/css/**"],
      }),
      babel({
        exclude: "node_modules/**",
      }),
      replace({
        exclude: "node_modules/**",
        ENV: JSON.stringify(process.env.NODE_ENV || "development"),
      }),
      terser(),
    ],
  },
  {
    input: "src/js/chart.js",
    output: [
      {
        file: pkg.src,
        format: "es",
      },
    ],
    plugins: [
      postcssPlugin({
        preprocessor: (content, id) =>
          new Promise((resolve, reject) => {
            const result = sass.renderSync({ file: id });
            resolve({ code: result.css.toString() });
          }),
        extensions: [".scss"],
        extract: "dist/frappe-charts.min.css",
        plugins: [nested(), cssnext({ warnForDuplicates: false }), cssnano()],
      }),
      eslint({
        exclude: ["src/css/**"],
      }),
      replace({
        exclude: "node_modules/**",
        ENV: JSON.stringify(process.env.NODE_ENV || "development"),
      }),
    ],
  },
];


const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')

const path = require("path");
const rimraf = require('rimraf');

const project = require('./project.config');

const inProject = (concatesDirname) => path.resolve(project.basePath, concatesDirname);
const inProjectSrc = (fileName) => path.resolve(inProject(project.srcDir), fileName)
const inProjectAssets = (fileName) => path.resolve(inProject(project.assetsDir), fileName)


const _DEV_ = process.env.NODE_ENV == 'development';


const extractStyles = new ExtractTextPlugin({
    filename: 'styles/[name].[hash].css',
    allChunks: true,
    disable: _DEV_,
});

const config = {
    entry: {
        main: [inProjectSrc(project.main)]
    },
    output: {
        path: inProject(project.outDir),
        filename: "bundle.[hash].js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: inProject('node_modules'),
                use: {
                    loader: 'babel-loader'
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.scss$/,
                use: extractStyles.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: project.enableSourceMap,
                                modules: {
                                    localIdentName: '[name]__[local]__[hash:base64:5]',
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                        },
                    ],
                })
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }, {
                test: /\.(png|jpg|gif|svg|gltf)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }
        ],
    },
    devtool: project.enableSourceMap && 'source-map',
    resolve: {
        modules: [inProject(project.srcDir), 'node_modules'],
        extensions: ['*', '.js', '.jsx', '.JSX'],
    },
    devServer: {
        contentBase: inProject(project.assetsDir),
        port: 3001,
        hot: true,
        historyApiFallback: true,
        open: true,
        overlay: true
    },

    plugins: [
        //custom plugin for clearing ./dist
        {
            apply: (compiler) => {
                rimraf.sync(compiler.options.output.path)
            }
        },
        //replace html from publick to dist with [hash] imports
        new HtmlWebpackPlugin({
            template: inProjectAssets(project.htmlTemplate)
        }),
        //global cloneDeep import
        new webpack.ProvidePlugin({
            cloneDeep: 'lodash/cloneDeep'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
        extractStyles,
        new CopyWebpackPlugin([
            { from: inProject(project.assetsDir), to: inProject(project.outDir) },
        ]),
    ]
};

if (!_DEV_) {
    config.optimization = {
        minimize: true,
        minimizer: [new TerserPlugin({
            cache: true,
            parallel: true,
            exclude: inProject('node_modules'),
            exclude: inProject('node_modules'),

            terserOptions: {
                output: {
                    comments: false,
                },
            },
        })],
    }
}

module.exports = config;

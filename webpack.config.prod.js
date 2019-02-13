const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const htmlWebpackPlugin = require('html-webpack-plugin');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//const webpack = require('webpack');
const ParallelUglify = require('webpack-parallel-uglify-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");


function fillDouble (input) {
    return input < 10 ? '0' + input : input;
}

var releaseTime = new Date();
var version = '' + releaseTime.getFullYear() + fillDouble(releaseTime.getMonth() + 1) + fillDouble(releaseTime.getDate()) + fillDouble(releaseTime.getHours()) + fillDouble(releaseTime.getMinutes());


module.exports = {
    mode: 'production',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './production/dist'),

        // 发布后，资源的引用目录
        publicPath: '//sfile.yourway.io/dist/',

        // 文件名称
        filename: 'js/[name].js',

        // 按需加载模块时输出的文件名称
        chunkFilename: 'js/[name].js?v=' + version,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader',
                options: {
                    name: 'font/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': __dirname + '/src/components/',
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    externals: {
        Vue: {
            root: 'Vue',
            commonjs: 'vue',
            commonjs2: 'vue',
            amd: 'vue'
        },
        Vuetify: {
            root: 'Vuetify',
            commonjs: 'Vuetify',
            commonjs2: 'Vuetify',
            amd: 'Vuetify'
        },
    },
    //配置插件
    optimization: {
        minimize: true,
        minimizer: [
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
    },
    plugins: [

        //调用插件，情况build目录
        new CleanWebpackPlugin(['./production']),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash].css",
            chunkFilename: 'css/[name].[hash].css'
        }),

        //调用htmlwebpackplugin，设置模板相关的属性
        new htmlWebpackPlugin({
            //设置生成文件
            filename: __dirname + '/production/index.html',
            //设置html模板文件
            template: 'template/prod.html',
            //指定script标签注入位置
            inject: 'body',
            chunks: ['main'],
            favicon: './favicon.ico'
        }),


        new ParallelUglify({
            // 传递给 UglifyJS的参数如下：
            uglifyJS: {
                output: {
                    /*
                     是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果，
                     可以设置为false
                    */
                    beautify: false,
                    /*
                     是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为false
                    */
                    comments: false
                },
                compress: {
                    /*
                     是否在UglifyJS删除没有用到的代码时输出警告信息，默认为输出，可以设置为false关闭这些作用
                     不大的警告
                    */
                    warnings: false,

                    /*
                     是否删除代码中所有的console语句，默认为不删除，开启后，会删除所有的console语句
                    */
                    drop_console: false,

                    /*
                     是否内嵌虽然已经定义了，但是只用到一次的变量，比如将 var x = 1; y = x, 转换成 y = 5, 默认为不
                     转换，为了达到更好的压缩效果，可以设置为false
                    */
                    collapse_vars: false,

                    /*
                     是否提取出现了多次但是没有定义成变量去引用的静态值，比如将 x = 'xxx'; y = 'xxx'  转换成
                     var a = 'xxxx'; x = a; y = a; 默认为不转换，为了达到更好的压缩效果，可以设置为false
                    */
                    reduce_vars: false
                }
            }
        }),

        /*new webpack.LoaderOptionsPlugin({
            // test: /\.xxx$/, // may apply this only for some modules
            options: {
                //设置静态资源目录static
                build: {
                    assetsPublicPath: '/',
                    assetsSubDirectory: 'static'
                },
            }
        })*/


    ],
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true,
        //配置代理
        proxy: {
            '/wayio/': {
                //target: 'http://47.95.197.120:1023/',
                //target: 'http://192.168.5.17:8080/',
                target: 'http://192.168.2.23:8083/',
                //target: 'http://52.201.230.133:8080/',
                //target: 'https://platformuat.way.io',
                secure: false,
                changeOrigin: true
            },
        }
    },
    performance: {
        hints: false
    },
    devtool: false
};


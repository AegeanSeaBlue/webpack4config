var path = require('path')
var webpack = require('webpack')
var htmlWebpackPlugin = require('html-webpack-plugin');
var MinCssExtractPlugin = require('mini-css-extract-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'build.js'
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        i18n: '@kazupon/vue-i18n-loader'
                    }
                    // other vue-loader options go here
                }
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
                    name: 'fonts/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'Vue$': 'vue/dist/vue.esm.js',
            '@': __dirname + '/src/',
        },
        extensions: ['*', '.js', '.vue', '.json']
    },

    //配置第三方文件
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
    plugins: [

        //调用插件，情况build目录
        //new CleanWebpackPlugin(['./build']),

        //调用htmlwebpackplugin，设置模板相关的属性
        new htmlWebpackPlugin({
            //设置生成文件
            filename: __dirname + '/build/index.html',
            //设置html模板文件
            template: 'tmpl/index.html',
            //指定script标签注入位置
            inject: 'body',
            chunks: ['main'],
            favicon: './favicon.ico'
        }),

        //抽离css文件
        new MinCssExtractPlugin({
            //给分离出来的css文件命名
            filename: "css/[name].[hash].css",
            allChunks: true
        }),

        new webpack.LoaderOptionsPlugin({
            // test: /\.xxx$/, // may apply this only for some modules
            options: {
                //设置静态资源目录static
                build: {
                    assetsPublicPath: '/',
                    assetsSubDirectory: 'static'
                },
            }
        })


    ],
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        //配置代理
        proxy: {
            '/wayio/': {
                //target: 'http://47.95.197.120:1023/',
                //target: 'http://192.168.4.42:8083/',
                target: 'http://192.168.2.23:8083/',
                //target: 'https://platformuat.way.io',
                secure: false,
                changeOrigin: true
            },
            '/wayio/v2/': {
                //target: 'http://47.95.197.120:1023/',
                target: 'http://192.168.5.17:8080/wayio/v2/',
                //target: 'http://192.168.2.23:8083/',
                secure: false,
                changeOrigin: true
            },
        }
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
        // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}

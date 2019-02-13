const path = require('path');
//const VueLoaderPlugin = require('vue-loader/lib/plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        // 输出目录
        path: path.resolve(__dirname, './build/dist/'),

        // 发布后，资源的引用目录
        publicPath: '/dist/',

        // 文件名称
        filename: 'js/[name].js',

        // 按需加载模块时输出的文件名称
        chunkFilename: 'js/[name].js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders:{
                        i18n:'@kazupon/vue-i18n-loader'
                    }
                }
            },
            /*{
                resourceQuery: /blockType=i18n/,
                type: 'javascript/auto',
                loader: '@kazupon/vue-i18n-loader'
            },*/
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
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
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
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
            }
        }
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',
    plugins: [
        //new VueLoaderPlugin(),
        new htmlWebpackPlugin({
            //设置生成文件
            filename: __dirname + '/build/index.html',
            //设置html模板文件
            template: 'template/index.html',
            //指定script标签注入位置
            inject: 'body',
            chunks: ['main'],
            favicon: './favicon.ico'
        }),
    ]
};

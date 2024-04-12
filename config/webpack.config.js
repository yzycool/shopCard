/** @format */
const path = require('path');
const WebpackBar = require('webpackbar');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
// const ESLintPlugin = require('eslint-webpack-plugin');

const webpack = require('webpack');
// 注入环境变量
require('dotenv').config();

const { name: packageName } = require('../package.json');
const resolvePath = relativePath => path.resolve(__dirname, relativePath);

const paths = {
  src: resolvePath('../src'),
  dist: resolvePath('../dist'),
  entry: resolvePath('../src/index'),
  html: resolvePath('../public/index.html'),
  babelFile: resolvePath('../.babelrc'),
  nodeModules: resolvePath('../node_modules'),
};

const cssExtractOption = {
  filename: 'static/css/[name].[contenthash:8].css',
  chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
};

module.exports = env => {
  const [isDev, isProd] = [env.development, env.production];

  // 是否生成包大小分析报告
  const isAnalyze = env.analyze;

  return {
    mode: isProd ? 'production' : 'development',
    // 控制日志的显示
    stats: isProd ? 'errors-only' : 'normal',
    devtool: 'eval-cheap-module-source-map',
    devtool: isProd ? false : 'eval-cheap-module-source-map',
    output: {
      // 每次构建时清空 dist
      clean: true,
      // Library指定了导出库的名称
      library: `${packageName}-[name]`,
      // LibraryTarget决定了库的类型
      libraryTarget: 'umd',
      chunkLoadingGlobal: `webpackJsonp_${packageName}`,
      globalObject: 'window',
      // 在 bundle 中取消生成路径信息的注释
      pathinfo: false,
      // 构建产物生成路径
      path: paths.dist,
      // 开发环境下无需关注[fullhash]/[chunkhash]/[contenthash]
      filename: isProd ? 'static/js/[name].[contenthash:8].js' : 'static/js[name].js',
      // 项目运行时异步加载的文件（非入口文件）名称
      chunkFilename: isProd
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : 'static/js[name].chunk.js',
      assetModuleFilename: isProd
        ? 'static/media/[hash:8][ext][query]'
        : 'static/media/[name][ext][query]',
      // 根据实际情况进行publicPath的设置
      publicPath: isProd ? process.env.PUBLIC_PATH : 'http://localhost:30022/',
    },
    // 开发环境下使用文件系统持久化缓存加快构建速度
    cache: isProd ? false : { type: 'filesystem' },
    devServer: {
      // 开发服务端口
      port: 30022,
      hot: true,
      open: false,
      liveReload: false,
      historyApiFallback: true,
      headers: {
        // 开启跨源资源共享
        'Access-Control-Allow-Origin': '*',
      },
      client: {
        // 新版的devserver在微前端模式下，ws会自动连接到主工程的域名。这里主动声明ws地址
        // webSocketURL: 'ws://localhost:30022/ws',
        // 是否在页面上全屏显示错误
        overlay: false,
      },

      // 服务器代理 --> 解决开发环境跨域问题
      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:3000',
      //     // 发送请求时，请求路径重写：将 /api/xxx --> /xxx （去掉/api）
      //     pathRewrite: {
      //       '^/api': '',
      //     },
      //   },
      // },
    },
    plugins: [
      // 显示构建进度条
      new WebpackBar(),
      new HtmlWebpackPlugin({ template: paths.html }),
      // 开发环境下，启用热更新
      isDev && new ReactRefreshWebpackPlugin(),
      // 是否在构建时显示ESlint错误
      // new ESLintPlugin({
      //   files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js'],
      //   extensions: ['.ts', '.tsx', '.js'],
      //   emitError: true,
      //   emitWarning: true,
      //   failOnError: false,
      //   failOnWarning: false,
      // }),
      // 在独立的进程中运行 TypeScript 类型检查 在使用babel-loader的情况下
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
          mode: 'write-references',
        },
      }),
      // 生产环境下，提取 CSS 到单独的文件
      isProd && new MiniCssExtractPlugin(cssExtractOption),
      // 可视化包大小分析
      isAnalyze && new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
      // 注入环境变量
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
      }),
      // nodejs核心模块的polyfill自动引入 -如需要开启即可
      // new webpack.ProvidePlugin({
      //   Buffer: ["buffer", "Buffer"],
      // }),
      // new webpack.ProvidePlugin({
      //   process: "process/browser",
      // }),
    ].filter(Boolean),
    resolve: {
      // nodejs核心模块的polyfill自动引入 -如需要开启即可
      // fallback: {
      //   stream: require.resolve("stream-browserify"),
      //   buffer: require.resolve("buffer"),
      // },
      // 取消对符号链接位置的解析
      symlinks: false,
      // 复用 tsconfig.json 的 paths 别名设置
      plugins: [new TsconfigPathsPlugin()],
      // 模块后缀解析，尽量只包含使用到的且频率高的放前面
      extensions: ['.tsx', '.ts', '.js', '.json'],
      // 指定模块的查找路径，避免逐层查找
      modules: ['node_modules', paths.nodeModules],
      // tsconfig中已经配置了@的解析 此处为js的配置解析 如果全部为ts文件，则无需配置此处
      // alias: {
      //   '@': path.resolve(__dirname, 'src'),
      // },
    },
    module: {
      rules: [
        {
          // 开发环境使用 style-loader 将 CSS 嵌入 DOM，生产环境提取 CSS 到单独的文件
          test: /\.(sc|c)ss$/,
          include: paths.src,
          use: [
            isDev && 'style-loader',
            isProd && MiniCssExtractPlugin.loader,
            'css-loader',
            'scoped-css-loader',
            {
              loader: 'sass-loader',
            },
          ].filter(Boolean),
        },
        {
          test: /\.less$/,
          include: paths.src,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /\.(js|ts|tsx)$/,
          include: paths.src,
          use: [
            {
              loader: 'babel-loader',
              options: {
                // 使用默认的缓存目录读取构建结果，避免每次执行时重新编译可能产生的高性能消耗
                cacheDirectory: true,
                configFile: paths.babelFile,
                plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean),
              },
            },
          ],
        },
        {
          // 使用 Webpack 5 的资源模块 API 处理
          test: /\.(bmp|png|jpe?g|gif|svg)$/,
          type: 'asset',
          parser: {
            // 小于 4kb 的文件，当作 inline 模块，否则作为 resource 模块
            dataUrlCondition: { maxSize: 4 * 1024 },
          },
        },
      ],
    },
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            // 构建时去除备注信息
            format: { comments: false },
          },
          // 构建时取消生成 license.txt 等备注文件
          extractComments: false,
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                // 移除所有注释
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],
      // 抽离公共类库
      splitChunks: {
        chunks: 'all',
        //  开发环境下合并为一个 chunk
        name: 'chunk',
      },
      runtimeChunk: {
        // 为每个入口添加一个单独的 runtime chunk 文件
        name: entrypoint => `runtime~${entrypoint.name}`,
      },
    },
  };
};

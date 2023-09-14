import webpack from 'webpack';
import path from 'path';
import {createHash} from 'crypto';
import WebpackNotifierPlugin from 'webpack-notifier';
import CompressionPlugin from 'compression-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import BitBarWebpackProgressPlugin from 'bitbar-webpack-progress-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import TerserPlugin from 'terser-webpack-plugin';
import {AngularWebpackPlugin} from '@ngtools/webpack';
import linkerPlugin from '@angular/compiler-cli/linker/babel';
import asyncGeneratorFunctions from '@babel/plugin-proposal-async-generator-functions';
import asyncToGenerator from '@babel/plugin-transform-async-to-generator';
import {JavaScriptOptimizerPlugin} from '@angular-devkit/build-angular/src/tools/webpack/plugins/javascript-optimizer-plugin.js';
import {dirName, konamiResolve, numeralResolve, cryptoBrowserifyResolve, bufferResolve, streamBrowserifyResolve, formDataResolve, ngVersion, tsConfig, webpackConfig} from './webpack.commonjs.cjs';
import {sharedDependenciesLazy} from '../deps.cjs';

const distPath = 'wwwroot';

export default [function(options, args)
{
    var prod = args && args.mode == 'production' || false;
    var hmr = !!options && !!options.hmr;
    var ssr = !!options && !!options.ssr;
    var debug = !!options && !!options.debug;
    var css = !!options && !!options.css;
    var html = !!options && !!options.html;
    var nomangle = !!options && !!options.nomangle;
    var noCache = !!options && !!options.noCache;
    var esbuild = !!options && !!options.esbuild;
    var ngsw = process.env.NGSW == 'true';

    if(!!options && options.ngsw != undefined)
    {
        ngsw = !!options.ngsw;
    }

    console.log(`Angular service worker enabled: ${ngsw}.`);

    options = options || {};

    console.log(`Running build with following configuration Production: ${prod} HMR: ${hmr} SSR: ${ssr} Debug: ${debug} CSS: ${css} HTML: ${html} NoMangle: ${nomangle} NoCache: ${noCache} EsBuild: ${esbuild}`);

    const config =
    {
        entry:
        {
            'main': './app'
        },
        output:
        {
            globalObject: 'self',
            path: path.join(dirName, distPath),
            filename: `[name].js`,
            publicPath: 'auto',
            chunkFilename: `[name].${ssr ? 'server' : 'client'}.chunk.js`,
            assetModuleFilename: 'assets/[hash][ext][query]'
        },
        mode: 'development',
        ...hmr ?
            {
                devServer:
                {
                    hot: true,
                    port: 9002,
                    static:
                    {
                        directory: path.join(dirName, distPath, 'assets'),
                        publicPath: '/dist/assets',
                        watch: true
                    },
                    devMiddleware:
                    {
                        publicPath: '/dist/',
                        writeToDisk: true,
                    },
                    client:
                    {
                        logging: 'info',
                        overlay:
                        {
                            errors: true,
                            warnings: false
                        },
                        progress: true,
                    },
                },
                devtool: 'eval-source-map'
            } :
            {
                devtool: 'source-map'
            },
        target: ssr ? 'node' : 'web',
        ...noCache ? {} :
        {
            cache:
            {
                type: 'filesystem',
                cacheDirectory: path.join(dirName, "node_modules", ".cache", 'angular-webpack'),
                maxMemoryGenerations: 1,
                name: createHash('sha1')
                    .update(ngVersion)
                    .update(dirName)
                    .update(tsConfig)
                    .update(webpackConfig)
                    .digest('hex'),
            }
        },
        resolve:
        {
            symlinks: false,
            fallback:
            {
                "crypto": cryptoBrowserifyResolve,
                "buffer": bufferResolve,
                "stream": streamBrowserifyResolve
            },
            extensions: ['.ts', '.mjs', '.js'],
            alias:
            {
                "numeral-languages": path.join(dirName, "../node_modules/numeral/locales.js"),
                "shared-stuff": path.join(dirName, "../shared-stuff/index.ts"),
                "app-config": path.join(dirName, "../app-config/index.ts"),
            },
            mainFields: ssr ? ['esm2022', 'esm2015', 'es2015', 'jsnext:main', 'module', 'main'] : ['esm2022', 'es2022', 'esm2020', 'esm2015', 'es2015', 'jsnext:main', 'browser', 'module', 'main'],
            conditionNames: ['esm2022', 'es2022', 'esm2020', 'es2015', 'import']
        },
        module:
        {
            rules:
            [
                {
                    test: numeralResolve,
                    use:
                    [
                        {
                            loader: 'expose-loader',
                            options:
                            {
                                exposes: 'numeral'
                            }
                        }
                    ]
                },
                {
                    test: konamiResolve,
                    use:
                    [
                        {
                            loader: 'expose-loader',
                            options:
                            {
                                exposes: 'Konami'
                            }
                        }
                    ]
                },
                //server globals
                {
                    test: formDataResolve,
                    use:
                    [
                        {
                            loader: 'expose-loader',
                            options:
                            {
                                exposes: 'FormData'
                            }
                        }
                    ]
                },
                //file processing
                {
                    test: /\.ts$/,
                    use:
                    [
                        {
                            loader: 'babel-loader',
                            options:
                            {
                                plugins:
                                [
                                    asyncGeneratorFunctions,
                                    asyncToGenerator,
                                ],
                                compact: false,
                                cacheDirectory: true,
                            }
                        },
                        '@ngtools/webpack',
                    ]
                },
                {
                    test: /\.m?js$/,
                    use:
                    {
                        loader: 'babel-loader',
                        options:
                        {
                            plugins:
                            [
                                linkerPlugin,
                                asyncGeneratorFunctions,
                                asyncToGenerator,
                            ],
                            compact: false,
                            cacheDirectory: true,
                        }
                    },
                    resolve:
                    {
                        fullySpecified: false
                    },
                },
                {
                    test: /\.html$/,
                    use: ['raw-loader']
                },
                {
                    test: /\.component\.scss$/,
                    use: ['raw-loader', 'sass-loader'],
                    include:
                    [
                        path.join(dirName, 'app')
                    ]
                },
                {
                    test: /\.(ttf|woff|woff2|eot|svg|png|jpeg|jpg|bmp|gif|icon|ico)$/,
                    type: 'asset/resource'
                },
            ]
        },
        plugins:
        [
            new webpack.container.ModuleFederationPlugin(
            {
                name: 'cmp',
                filename: 'remoteEntry.js',
                exposes:
                {
                    './plugin': './app/plugin',
                },
                shared:
                {
                    ...sharedDependenciesLazy,
                },
            }),
            new WebpackNotifierPlugin({title: `Webpack - ${hmr ? 'HMR' : (ssr ? 'SSR' : 'BUILD')}`, excludeWarnings: true, alwaysNotify: true, sound: false}),
            //copy external dependencies
            // new CopyWebpackPlugin(
            // {
            // }),
            new BitBarWebpackProgressPlugin(),
            new webpack.DefinePlugin(
            {
                isProduction: prod,
                isNgsw: ngsw,
                jsDevMode: !prod,
                ...prod ? {ngDevMode: false} : {},
                ngI18nClosureMode: false
            }),
            new AngularWebpackPlugin(
            {
                tsConfigPath: path.join(dirName, 'tsconfig.json'),
                sourceMap: true,
            }),
        ],
    };

    if(prod && esbuild)
    {
        config.optimization =
        {
            minimizer:
            [
                new JavaScriptOptimizerPlugin(
                {
                    // define: buildOptions.aot ? GLOBAL_DEFS_FOR_TERSER_WITH_AOT : GLOBAL_DEFS_FOR_TERSER,
                    sourcemap: true,
                    // target: ScriptTarget.ES2020,
                    target: 7,
                    keepNames: nomangle,
                    removeLicenses: false,
                    // advanced: buildOptions.buildOptimizer,
                })
            ]
        };
    }

    if(prod && nomangle && !esbuild)
    {
        config.optimization =
        {
            minimize: true,
            minimizer:
            [
                new TerserPlugin(
                {
                    terserOptions:
                    {
                        mangle: false
                    }
                })
            ]
        };
    }

    //production specific settings - prod is used only for client part
    if(prod)
    {
        config.output.filename = `[name].[hash].js`;
        config.output.chunkFilename = `[name].${ssr ? 'server' : 'client'}.chunk.[chunkhash].js`;

        config.plugins.push(new CompressionPlugin({test: /\.js$|\.css$/}));
    }

    //this is used for debugging speed of compilation
    if(debug)
    {
        config.plugins.push(new BundleAnalyzerPlugin());

        let smp = new SpeedMeasurePlugin({outputFormat: 'humanVerbose'});

        return smp.wrap(config);
    }

    return config;
}];

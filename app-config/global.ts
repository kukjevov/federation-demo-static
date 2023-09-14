
declare const isProduction: boolean;
declare const isNgsw: boolean;
declare const __webpack_init_sharing__: (scope: string) => Promise<void>;
declare const __webpack_share_scopes__: Record<string, Record<string, unknown>>;

interface ImportMeta
{
    webpackHot?: boolean;
}

declare module 'xhr2'
{
    const anything: any;

    export = anything;
}
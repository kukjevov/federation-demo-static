import {Inject, Injectable, OnDestroy} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {LOGGER, Logger} from '@anglr/common';
import {Action1, Dictionary, NoopAction, WithSync} from '@jscrpt/common';
import {PluginConfig} from 'app-config';

import {PluginContainer, PluginDef} from './pluginLoader.interface';

const SHARE_SCOPE = 'default';
const DEFAULT_MODULE = './plugin';

/**
 * Plugin loader for loading dynamic plugins
 */
@Injectable({providedIn: 'root'})
export class PluginLoader implements OnDestroy
{
    //######################### private fields #########################

    /**
     * All loaded scripts elements by their urls
     */
    private _loadedScripts: Dictionary<HTMLScriptElement> = {};

    /**
     * Promises for loading scripts
     */
    private _loadScriptPromises: Dictionary<Promise<void>|undefined> = {};

    /**
     * All loaded modules
     */
    private _loadedModules: Dictionary<PluginDef> = {};

    //######################### constructor #########################
    constructor(@Inject(DOCUMENT) private _document: Document,
                @Inject(LOGGER) private _logger: Logger,)
    {
    }

    //######################### public methods #########################

    /**
     * Gets plugin definition using its configuration
     * @param config - Config definition of plugin
     */
    public async getPlugin(config: PluginConfig): Promise<PluginDef|undefined|null>
    {
        try
        {
            await this._loadScript(config.url);
            
            return this._loadModule(config.scope, config.module);
        }
        catch(e)
        {
            this._logger.error(`PluginLoader: failed to load plugin ${e}`);

            return null;
        }
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        for(const url in this._loadedScripts)
        {
            const scriptElement = this._loadedScripts[url];

            scriptElement.remove();
            delete this._loadedScripts[url];
        }
    }

    //######################### private methods #########################

    /**
     * Loads script containing plugin definition
     * @param url - Url where plugin should be stored
     */
    private _loadScript(url: string): Promise<void>
    {
        const existingPromise = this._loadScriptPromises[url];

        if(existingPromise)
        {
            return existingPromise;
        }

        let resolve: NoopAction;
        let reject: Action1<string|Event>;

        const promise = new Promise<void>((res, rej) =>
        {
            resolve = res;
            reject = rej;
        });

        this._loadScriptPromises[url] = promise;

        const element = this._document.createElement('script');
        element.src = url;
        element.type = 'text/javascript';
        element.async = true;
        element.onload = () => resolve();
        element.onerror = e => reject(e);

        this._document.head.appendChild(element);
        this._loadedScripts[url] = element;

        return promise;
    }

    /**
     * Loads module
     * @param scope - Name of scope to be obtained
     * @param module - Name of module
     */
    @WithSync()
    private async _loadModule(scope: string, module?: string): Promise<PluginDef>
    {
        const moduleKey = `${scope}-${module ?? DEFAULT_MODULE}`;

        if(this._loadedModules[moduleKey])
        {
            return this._loadedModules[moduleKey];
        }

        await __webpack_init_sharing__(SHARE_SCOPE);
        const container = (window as any)[scope] as PluginContainer<PluginDef>;
        await container.init(__webpack_share_scopes__[SHARE_SCOPE]);
        const factory = await container.get(module ?? DEFAULT_MODULE);
        const moduleObject = factory();

        if(!moduleObject.routes)
        {
            throw new Error(`PluginLoader: missing routes for scope: '${scope}' and module: '${module ?? DEFAULT_MODULE}'`);
        }

        if(!moduleObject.menu)
        {
            this._logger.warn(`PluginLoader: missing menu component type for scope: '${scope}' and module: '${module ?? DEFAULT_MODULE}'`);
        }

        this._loadedModules[moduleKey] = moduleObject;

        return moduleObject;
    }
}
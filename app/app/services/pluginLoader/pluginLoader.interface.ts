import {Type} from '@angular/core';
import {Route} from '@angular/router';
import {Func} from '@jscrpt/common';

/**
 * Definition of plugin
 */
export interface PluginDef
{
    /**
     * Component that is displayed in menu
     */
    menu?: Type<unknown>;

    /**
     * Array of routes added to app
     */
    routes: Route[];
}

/**
 * Plugin container definition
 */
export interface PluginContainer<TModule = unknown>
{
    /**
     * Method that initialize container
     * @param scopes - Available initialized shared scopes
     */
    init(scopes: Record<string, unknown>): Promise<void>;

    /**
     * Method that gets container module factory
     * @param moduleName - Name of module that should be obtained
     */
    get(moduleName: string): Promise<Func<TModule>>;
}
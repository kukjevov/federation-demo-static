import {NgModule} from '@angular/core';
import {ModuleRoutes} from '@anglr/common/router';
import {SharedCmpSAComponent} from 'shared-stuff';

import {components} from './default.routes';
import {DebuggingFeatureModule, DisplayingFeatureModule, FormsFeatureModule} from '../../modules';

/**
 * Module for Default application pages
 */
@NgModule(
{
    imports:
    [
        DisplayingFeatureModule,
        FormsFeatureModule,
        DebuggingFeatureModule,
        SharedCmpSAComponent,
    ],
    declarations:
    [
        ...components
    ]
})
@ModuleRoutes(components)
export class DefaultModule
{
}
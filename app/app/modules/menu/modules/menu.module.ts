import {NgModule} from '@angular/core';
import {TitledDialogModule} from '@anglr/common/material';
import {SomethingMenuSAComponent} from 'cmp/components';
import {SampleMenuSAComponent} from 'lib/components';

import {DisplayingFeatureModule} from '../../displayingFeature.module';
import {MainMenuComponent} from '../components';
import {UserSettingsSAComponent} from '../../../components';

/**
 * Module for menu components
 */
@NgModule(
{
    imports:
    [
        DisplayingFeatureModule,
        UserSettingsSAComponent,
        TitledDialogModule,
        SomethingMenuSAComponent,
        SampleMenuSAComponent,
    ],
    declarations:
    [
        MainMenuComponent
    ],
    exports:
    [
        MainMenuComponent
    ]
})
export class MenuModule
{
}
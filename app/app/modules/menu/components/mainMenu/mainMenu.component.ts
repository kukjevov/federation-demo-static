import {Component, ChangeDetectionStrategy, OnInit, Type, ChangeDetectorRef} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '@anglr/authentication';
import {TitledDialogService} from '@anglr/common/material';
import {config} from 'app-config';

import {UserSettingsSAComponent} from '../../../../components';
import {PluginLoader} from '../../../../services/pluginLoader';

/**
 * Component used for displaying application main menu
 */
@Component(
{
    selector: 'main-menu',
    templateUrl: 'mainMenu.component.html',
    // styleUrls: ['mainMenu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainMenuComponent implements OnInit
{
    //######################### protected properties - template bindings #########################

    /**
     * Array of dynamic menu items
     */
    protected dynamicMenuItems: Type<unknown>[] = [];

    //######################### constructor #########################
    constructor(private _authSvc: AuthenticationService<any>,
                private _router: Router,
                private _dialog: TitledDialogService,
                private _pluginLoader: PluginLoader,
                private _changeDetector: ChangeDetectorRef,)
    {
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public async ngOnInit(): Promise<void>
    {
        for(const pluginConfig of config.plugins)
        {
            const pluginDef = await this._pluginLoader.getPlugin(pluginConfig);

            if(pluginDef?.menu)
            {
                this.dynamicMenuItems.push(pluginDef.menu);
            }
        }

        this._changeDetector.detectChanges();
    }

    //######################### public methods - template bindings #########################

    /**
     * Logs out user
     */
    public async logout()
    {
        this._authSvc
            .logout()
            .subscribe(() =>
            {
                this._router.navigate(['/login']);
            });
    }

    /**
     * Opens settings dialog
     */
    public openSettings()
    {
        this._dialog.open(UserSettingsSAComponent,
        {
            title: 'user settings',
            maxHeight: '80vh'
        });
    }
}
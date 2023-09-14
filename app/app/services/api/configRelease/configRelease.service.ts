import {Injectable} from '@angular/core';
import {RESTClient, GET, BaseUrl, DefaultHeaders} from '@anglr/rest';
import {NEVER, Observable} from 'rxjs';
import {config} from 'app-config';

import {ConfigReleaseData} from './configRelease.interface';

/**
 * Service used to access configuration of application
 */
@Injectable()
@BaseUrl(config.configuration.apiBaseUrl)
@DefaultHeaders(config.configuration.defaultApiHeaders)
export class ConfigReleaseService extends RESTClient
{
    //######################### public methods #########################

    /**
     * Gets configuration of app
     * @returns Observable
     */
    @GET('config/release')
    public get(): Observable<ConfigReleaseData>
    {
        return NEVER;
    }
}

import {ClassProvider, EnvironmentProviders, Provider, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {extractRoutes} from '@anglr/common/router';
import {TitledDialogService} from '@anglr/common/material';
import {provideGlobalNotifications} from '@anglr/notifications';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {config} from 'app-config';

import {WebpackTranslateLoaderService} from '../services/webpackTranslateLoader';
import {ReportMissingTranslationService} from '../services/missingTranslation';
import {accessDeniedRoute} from '../pages/accessDenied/accessDenied.route';
import {notFoundRoute} from '../pages/notFound/notFound.route';
import {components} from './app.component.routes';

/**
 * Root app providers 
 */
export const appProviders: (Provider|EnvironmentProviders)[] =
[
    provideZoneChangeDetection({eventCoalescing: true, runCoalescing: true}),
    provideHttpClient(withInterceptorsFromDi(),),
    importProvidersFrom(MatDialogModule),
    TitledDialogService,
    provideGlobalNotifications(),
    importProvidersFrom(TranslateModule.forRoot(
    {
        loader: <ClassProvider>
        {
            provide: TranslateLoader, 
            useClass: WebpackTranslateLoaderService
        },
        ...config.configuration.debugTranslations ? 
            {
                missingTranslationHandler:
                {
                    provide: MissingTranslationHandler,
                    useClass: ReportMissingTranslationService
                }
            } : 
            {
            },
        useDefaultLang: !config.configuration.debugTranslations
    })),
    provideRouter([
                      {
                          path: '',
                          loadChildren: () => import('../pages/+default/default.module').then(({DefaultModule}) => DefaultModule)
                      },
                      ...extractRoutes(components),
                      accessDeniedRoute,
                      notFoundRoute,
                  ],
                  withComponentInputBinding()),
];
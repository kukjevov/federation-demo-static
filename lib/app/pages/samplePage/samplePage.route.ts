import {Route} from '@angular/router';

/**
 * Route for sample page component
 */
export const samplePageRoute: Route =
{
    path: 'sample',
    loadComponent: () => import('./samplePage.component').then(({SamplePageSAComponent}) => SamplePageSAComponent)
};
import {Route} from '@angular/router';

/**
 * Route for something page component
 */
export const somethingPageRoute: Route =
{
    path: 'something',
    loadComponent: () => import('./somethingPage.component').then(({SomethingPageSAComponent}) => SomethingPageSAComponent)
};
import {Route} from '@angular/router';

import {SomethingMenuSAComponent} from './components';
import {somethingPageRoute} from './pages';

/**
 * Component that is displayed in menu
 */
export const menu = SomethingMenuSAComponent;

/**
 * Array of routes added to app
 */
export const routes: Route[] = 
[
    somethingPageRoute,
];
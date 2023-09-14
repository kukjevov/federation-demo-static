import {Route} from '@angular/router';

import {SampleMenuSAComponent} from './components';
import {samplePageRoute} from './pages';

/**
 * Component that is displayed in menu
 */
export const menu = SampleMenuSAComponent;

/**
 * Array of routes added to app
 */
export const routes: Route[] = 
[
    samplePageRoute,
];
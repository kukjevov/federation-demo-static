import {Component, ChangeDetectionStrategy} from '@angular/core';
import {RouterModule} from '@angular/router';

/**
 * Component that servers as menu something component
 */
@Component(
{
    selector: 'something-menu',
    templateUrl: 'somethingMenu.component.html',
    styleUrls: ['somethingMenu.component.scss'],
    standalone: true,
    imports:
    [
        RouterModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SomethingMenuSAComponent
{
}
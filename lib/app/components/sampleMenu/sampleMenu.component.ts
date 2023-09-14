import {Component, ChangeDetectionStrategy} from '@angular/core';
import {RouterModule} from '@angular/router';

/**
 * Component that servers as menu sample component
 */
@Component(
{
    selector: 'sample-menu',
    templateUrl: 'sampleMenu.component.html',
    styleUrls: ['sampleMenu.component.scss'],
    standalone: true,
    imports:
    [
        RouterModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleMenuSAComponent
{
}
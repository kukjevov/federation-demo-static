import {Component, ChangeDetectionStrategy} from '@angular/core';
import {SharedCmpSAComponent} from 'shared-stuff';

/**
 * Sample page component
 */
@Component(
{
    selector: 'sample-page',
    templateUrl: 'samplePage.component.html',
    standalone: true,
    imports:
    [
        SharedCmpSAComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SamplePageSAComponent
{
}

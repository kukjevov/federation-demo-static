import {Component, ChangeDetectionStrategy} from '@angular/core';
import {SharedCmpSAComponent} from 'shared-stuff';

/**
 * Something page component
 */
@Component(
{
    selector: 'something-page',
    templateUrl: 'somethingPage.component.html',
    standalone: true,
    imports:
    [
        SharedCmpSAComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SomethingPageSAComponent
{
}

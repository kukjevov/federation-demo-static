import {Component, ChangeDetectionStrategy} from '@angular/core';

/**
 * Component that will be shared among all subprojects
 */
@Component(
{
    selector: 'shared-cmp',
    templateUrl: 'sharedCmp.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedCmpSAComponent
{
}
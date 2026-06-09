import { Component, input } from '@angular/core';
import { ApplicationIcon } from '@placeos-tools/common';

@Component({
    selector: 'app-icon',
    template: `
        <div class="app-icon">
            @if (!icon() || icon()?.type !== 'img') {
            <i [class]="icon()?.class || className()">
                {{ icon()?.content }}
                <ng-content />
            </i>
            } @if (icon() && icon()?.type === 'img') {
            <img [src]="icon()?.src | safe: 'resource'" />
            }
        </div>
    `,
    styles: [
        `
            .app-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 1.25em;
                width: 1.25em;
            }

            i {
                font-size: 1em;
            }

            img {
                height: 1em;
                width: 1em;
            }
        `,
    ],
})
export class IconComponent {
    public readonly className = input<string>('material-icons');
    /** Icon details */
    public readonly icon = input<ApplicationIcon | undefined>();
}

import { Component, Input } from '@angular/core';
import { ApplicationIcon } from '@placeos-tools/common';

@Component({
    standalone: false,
    selector: 'app-icon',
    template: `
        <div class="app-icon">
          @if (!icon || icon.type !== 'img') {
            <i [class]="icon?.class || className">
              {{ icon?.content }}
              <ng-content></ng-content>
            </i>
          }
          @if (icon && icon.type === 'img') {
            <img [src]="icon.src | safe: 'resource'" />
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
    @Input() public className: string = 'material-icons';
    /** Icon details */
    @Input() public icon: ApplicationIcon;
}

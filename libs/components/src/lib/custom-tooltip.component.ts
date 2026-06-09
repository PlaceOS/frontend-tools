import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
    Component,
    ElementRef,
    HostListener,
    Injectable,
    Injector,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    TemplateRef,
    Type,
    inject,
    input,
    signal,
    viewChild,
} from '@angular/core';
import { BaseClass } from '@placeos-tools/common';

@Injectable()
export class CustomTooltipData<T = any> {
    data: T;
    close: () => void;
}

@Component({
    selector: '[customTooltip]',
    template: `
        <ng-content />

        <ng-template cdk-portal>
            <div custom-tooltip class="pointer-events-none">
                @switch (type()) {
                    @case ('component') {
                        <ng-container
                            *ngComponentOutlet="content(); injector: injector()"
                        />
                    }
                    @case ('html') {
                        <div [innerHTML]="content | sanitize"></div>
                    }
                    @default {
                        <ng-container
                            *ngTemplateOutlet="content(); context: data()"
                        />
                    }
                }
            </div>
        </ng-template>
    `,
    imports: [NgComponentOutlet, NgTemplateOutlet],
})
export class CustomTooltipComponent<T = any>
    extends BaseClass
    implements OnChanges, OnDestroy
{
    private _element = inject<ElementRef<HTMLElement>>(ElementRef);
    private _overlay = inject(Overlay);
    private _injector = inject(Injector);

    /** Horizontal position of the rendered overlay */
    public readonly x_pos = input<'start' | 'center' | 'end'>(undefined, {
        alias: 'xPosition',
    });
    /** Vertical position of the rendered overlay */
    public readonly y_pos = input<'top' | 'center' | 'bottom'>(undefined, {
        alias: 'yPosition',
    });
    /** Content to render in the tooltip */
    public readonly content = input<TemplateRef<any> | Type<any> | string>(
        undefined,
    );
    /** Data associated with the tooltip content */
    public readonly data = input<T>(undefined);
    /** Whether tooltip shows on hover */
    public readonly hover = input(false);
    /** Whether tooltip has a backdrop */
    public readonly backdrop = input(true);
    /** Type of content to render */
    public readonly type = signal<'template' | 'component' | 'html'>(
        'template',
    );

    public readonly injector = signal<Injector>(this._injector);

    private _overlay_ref: OverlayRef = null;

    private readonly _portal = viewChild(CdkPortal);

    @HostListener('click') public readonly onClick = () =>
        this.hover() ? '' : this.open();
    @HostListener('mouseenter') public readonly onEnter = () =>
        this.hover() ? this.open : '';
    @HostListener('mouseleave') public readonly onLeave = () =>
        this.hover() ? this.close : '';

    public ngOnChanges(changes: SimpleChanges): void {
        this._updateInjector();
        if (
            this._overlay_ref &&
            (changes.x_pos || changes.y_pos || changes.content)
        ) {
            this.open();
        }
    }

    public ngOnDestroy() {
        super.ngOnDestroy();
        this.close();
    }

    public open() {
        console.log('Open Tooltip');
        this._updateType();
        if (this._overlay_ref) this.close();
        const _portal = this._portal();
        if (!_portal) return;
        const y_pos = this.y_pos();
        this._overlay_ref = this._overlay.create({
            hasBackdrop: !!this.backdrop(),
            positionStrategy: this._overlay
                .position()
                .flexibleConnectedTo(this._element)
                .withPositions([
                    {
                        originX: this.x_pos() || 'end',
                        originY:
                            (y_pos === 'top'
                                ? 'bottom'
                                : y_pos == 'bottom'
                                  ? 'top'
                                  : y_pos) || 'bottom',
                        overlayX: this.x_pos() || 'end',
                        overlayY: this.y_pos() || 'top',
                    },
                ]),
        });
        this._overlay_ref.attach(_portal);
        if (this.backdrop()) {
            this.subscription(
                'backdrop',
                this._overlay_ref.backdropClick().subscribe(() => this.close()),
            );
        }
    }

    public close() {
        if (this._overlay_ref) {
            this._overlay_ref.dispose();
            this._overlay_ref = null;
        }
    }

    private _updateType() {
        const content = this.content();
        this.type.set(
            typeof content === 'string'
                ? 'html'
                : content instanceof TemplateRef
                  ? 'template'
                  : 'component',
        );
    }

    private _updateInjector() {
        this.injector.set(
            Injector.create({
                providers: [
                    {
                        provide: CustomTooltipData,
                        useValue: {
                            data: this.data(),
                            close: () => this.close(),
                        },
                    },
                ],
                parent: this._injector,
            }),
        );
    }
}

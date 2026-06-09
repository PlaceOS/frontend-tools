import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { EditorStateService } from '../app/editor/editor-state.service';

describe('EditorStateService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideZonelessChangeDetection(),
                {
                    provide: Clipboard,
                    useValue: { copy: vi.fn() },
                },
            ],
        });
    });

    it('updates the active editor action signal', () => {
        const service = TestBed.inject(EditorStateService);

        expect(service.action()).toBe('rect');

        service.setAction('add_points');
        expect(service.action()).toBe('add_points');

        service.setAction('remove_points');
        expect(service.action()).toBe('remove_points');
    });
});

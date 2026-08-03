vi.mock('@placeos/ts-client', () => ({
    authority: () => ({ domain: 'place.example.com' }),
    setup: async () => undefined,
    token: () => 'session-token',
}));

import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PlaceOSService } from '../app/data/placeos.service';

/** Records the last request so the auth headers can be checked */
function stubFetch(authority_ok: boolean) {
    const calls: [string, RequestInit][] = [];
    const fetch = vi.fn(async (url: string, options: RequestInit = {}) => {
        calls.push([url, options]);
        if (url.endsWith('/auth/authority'))
            return { ok: authority_ok, json: async () => ({}) };
        return { ok: true, json: async () => ({}) };
    });
    vi.stubGlobal('fetch', fetch);
    return calls;
}

describe('PlaceOSService', () => {
    let service: PlaceOSService;

    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection()],
        });
        service = TestBed.inject(PlaceOSService);
    });

    afterEach(() => vi.unstubAllGlobals());

    it('uses the domain session when the authority resolves', async () => {
        const calls = stubFetch(true);
        await service.init();
        expect(service.mode()).toBe('domain');
        expect(service.config.configured).toBe(true);

        await service.getZones();
        const [url, options] = calls[calls.length - 1];
        expect(url).toContain('/api/engine/v2/zones');
        expect(url.startsWith('/api')).toBe(true);
        expect((options.headers as any).Authorization).toBe(
            'Bearer session-token',
        );
    });

    it('falls back to a domain and API key otherwise', async () => {
        const calls = stubFetch(false);
        await service.init();
        expect(service.mode()).toBe('manual');
        expect(service.config.configured).toBe(false);
        await expect(service.getZones()).rejects.toThrow('not configured');

        service.setConfig('https://other.example.com/', 'secret');
        expect(service.config.configured).toBe(true);
        await service.getZones();
        const [url, options] = calls[calls.length - 1];
        expect(url.startsWith('https://other.example.com/api/engine/v2')).toBe(
            true,
        );
        expect((options.headers as any)['X-API-Key']).toBe('secret');
    });
});

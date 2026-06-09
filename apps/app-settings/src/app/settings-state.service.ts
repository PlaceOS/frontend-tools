import { Injectable, signal } from '@angular/core';
import { retrieveData, sendMessage } from '@placeos-tools/common';
import { generateSettingsForm } from './helpers';

@Injectable({
    providedIn: 'root',
})
export class SettingsStateService {
    private _loading = signal('');
    public readonly form = signal(generateSettingsForm());

    public readonly loading = this._loading.asReadonly();

    constructor() {
        setTimeout(() => this.loadSettings(), 300);
    }

    public async loadSettings() {
        const general = await retrieveData('settings');
        const workplace = await retrieveData('workplace_app');
        const concierge = await retrieveData('concierge_app');
        this.form().patchValue({
            general,
            workplace,
            concierge,
        });
    }

    public async saveSettings(type = 'settings') {
        const data = this.form().value;
        console.log(
            'Data:',
            data[type] || data[type.replace('_app', '')] || data.shared || {},
        );
        this._loading.set(
            `Saving changes to application metadata "${type}"...`,
        );
        await sendMessage({
            type: 'backoffice',
            action: 'metadata',
            name: type,
            content:
                data[type] ||
                data[type.replace('_app', '')] ||
                data.shared ||
                {},
        });
        this._loading.set(``);
    }
}

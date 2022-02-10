import { Injectable } from "@angular/core";
import { generateSettingsForm } from "./helpers";
import { retrieveData, sendMessage } from '@placeos-tools/common';
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SettingsStateService {
    private _loading = new BehaviorSubject('');
    public readonly form = generateSettingsForm();

    public readonly loading = this._loading.asObservable();

    public async loadSettings() {
        const general = await retrieveData('settings');
        const workplace = await retrieveData('workplace_app');
        const concierge = await retrieveData('concierge_app');
        this.form.patchValue({
            general,
            workplace,
            concierge
        })
    }

    public async saveSettings(type = 'settings') {
        const data = this.form.value;
        console.log('Data:', data);
        this._loading.next(`Saving changes to application metadata "${type}"...`);
        await sendMessage({
            type: 'backoffice',
            action: 'metadata',
            name: type,
            content: data[type] || data.shared || {},
        });
        this._loading.next(``);
    }
}

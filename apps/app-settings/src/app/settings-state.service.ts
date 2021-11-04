import { Injectable } from "@angular/core";
import { generateSettingsForm } from "./helpers";
import { retrieveData } from '@placeos-tools/common';

@Injectable({
    providedIn: 'root'
})
export class SettingsStateService {
    public readonly form = generateSettingsForm();

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
}

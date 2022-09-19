import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

export function generateSettingsForm() {
    return new UntypedFormGroup({
        shared: generateSharedSettingsForm(),
        workplace: generateWorkplaceSettingsForm(),
        concierge: generateConciergeSettingsForm(),
    });
}

export function generateSharedSettingsForm() {
    return new UntypedFormGroup({
        banner: new UntypedFormGroup({
            id: new UntypedFormControl(''),
            type: new UntypedFormControl('info'),
            content: new UntypedFormControl(''),
        }),
        name: new UntypedFormControl(''),
        title: new UntypedFormControl(''),
        short_name: new UntypedFormControl(''),
        logo_light: new UntypedFormControl({
            type: 'img',
            src: 'assets/logo-light.svg',
        }),
        logo_dark: new UntypedFormControl({
            type: 'img',
            src: 'assets/logo-dark.svg',
        }),
        css_variables: new UntypedFormControl({
            '--primary': '#c2185b',
            '--secondary': '#0a0d2e',
            '--success': '#43a047',
            '--pending': '#ffb300',
            '--error': '#e53935',
        }),
    });
}

export function generateWorkplaceSettingsForm() {
    return new UntypedFormGroup({
        banner: new UntypedFormGroup({
            id: new UntypedFormControl(''),
            type: new UntypedFormControl('info'),
            content: new UntypedFormControl(''),
        }),
        features: new UntypedFormControl([
            'spaces',
            'desks',
            'explore',
            'help',
            'schedule',
        ]),
        hide_availability: new UntypedFormControl(false),
        hide_contacts: new UntypedFormControl(false),
        can_deliver: new UntypedFormControl(false),
        general: generateGeneralSettingsForm(),
        schedule: new UntypedFormGroup({ legend: new UntypedFormControl([
            { name: 'Accepted', color: '#21A453' },
            { name: 'Pending', color: '#ffbf1f' },
            { name: 'Rejected', color: '#f44336' },
        ]) }),
        directory: new UntypedFormGroup({
            show_avatars: new UntypedFormControl(false),
            min_search_length: new UntypedFormControl(3),
        }),
        events: new UntypedFormGroup({
            allow_all_day: new UntypedFormControl(false),
            has_catering: new UntypedFormControl(false),
            hide_user_actions: new UntypedFormControl(false),
            can_book_for_others: new UntypedFormControl(false),
            multiple_spaces: new UntypedFormControl(false),
            max_duration: new UntypedFormControl(240, [Validators.min(15)]),
        }),
        desks: new UntypedFormGroup({
            recurrence_allowed: new UntypedFormControl(false),
            can_book_for_others: new UntypedFormControl(false),
            allow_group: new UntypedFormControl(false),
            needs_reason: new UntypedFormControl(false),
            allow_time_changes: new UntypedFormControl(false),
            allow_all_day: new UntypedFormControl(false),
            available_period: new UntypedFormControl(''),
            ignore_questions: new UntypedFormControl(true),
            auto_allocation: new UntypedFormControl(false),
        }),
        explore: new UntypedFormGroup({
            colors: new UntypedFormControl({}),
            can_select_building: new UntypedFormControl(false),
            show_legend_group_names: new UntypedFormControl(false),
            legend: new UntypedFormControl({}),
        }),
        css_variables: new UntypedFormControl({
            '--primary': '#c2185b',
            '--secondary': '#0a0d2e',
            '--success': '#43a047',
            '--pending': '#ffb300',
            '--error': '#e53935',
        }),
    });
}

export function generateGeneralSettingsForm() {
    return new UntypedFormGroup({
        menu: new UntypedFormControl([]),
    });
}

export function generateConciergeSettingsForm() {
    return new UntypedFormGroup({
        banner: new UntypedFormGroup({
            id: new UntypedFormControl(''),
            type: new UntypedFormControl('info'),
            content: new UntypedFormControl(''),
        }),
        features: new UntypedFormControl([
            'daily-calendar',
            'facilities',
            'catering',
            'visitors',
            'desks',
            'reports',
        ]),
        general: generateGeneralSettingsForm(),
        css_variables: new UntypedFormControl({
            '--primary': '#c2185b',
            '--secondary': '#0a0d2e',
            '--success': '#43a047',
            '--pending': '#ffb300',
            '--error': '#e53935',
        }),
    });
}

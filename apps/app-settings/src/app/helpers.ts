import { FormControl, FormGroup } from '@angular/forms';

export function generateSettingsForm() {
    return new FormGroup({
        shared: generateSharedSettingsForm(),
        workplace: generateWorkplaceSettingsForm(),
        concierge: generateConciergeSettingsForm(),
    });
}

export function generateSharedSettingsForm() {
    return new FormGroup({
        banner: new FormGroup({
            id: new FormControl(''),
            type: new FormControl('info'),
            content: new FormControl(''),
        }),
        name: new FormControl(''),
        title: new FormControl(''),
        short_name: new FormControl(''),
        logo_light: new FormControl({
            type: 'img',
            src: 'assets/logo-light.svg',
        }),
        logo_dark: new FormControl({
            type: 'img',
            src: 'assets/logo-dark.svg',
        }),
        css_variables: new FormControl({
            '--primary': '#c2185b',
            '--secondary': '#0a0d2e',
            '--success': '#43a047',
            '--pending': '#ffb300',
            '--error': '#e53935',
        }),
    });
}

export function generateWorkplaceSettingsForm() {
    return new FormGroup({
        banner: new FormGroup({
            id: new FormControl(''),
            type: new FormControl('info'),
            content: new FormControl(''),
        }),
        features: new FormControl([
            'spaces',
            'desks',
            'explore',
            'help',
            'schedule',
        ]),
        hide_contacts: new FormControl(false),
        can_deliver: new FormControl(false),
        general: generateGeneralSettingsForm(),
        schedule: new FormGroup({ legend: new FormControl([
            { name: 'Accepted', color: '#21A453' },
            { name: 'Pending', color: '#ffbf1f' },
            { name: 'Rejected', color: '#f44336' },
        ]) }),
        directory: new FormGroup({
            show_avatars: new FormControl(false),
            min_search_length: new FormControl(3),
        }),
        events: new FormGroup({
            allow_all_day: new FormControl(false),
            has_catering: new FormControl(false),
            hide_user_actions: new FormControl(false),
            can_book_for_others: new FormControl(false),
            multiple_spaces: new FormControl(false),
        }),
        desks: new FormGroup({
            recurrence_allowed: new FormControl(false),
            allow_groups: new FormControl(false),
            needs_reason: new FormControl(false),
            allow_time_changes: new FormControl(false),
            allow_all_day: new FormControl(false),
            available_period: new FormControl(''),
            auto_allocation: new FormControl(false),
        }),
        explore: new FormGroup({
            colors: new FormControl({}),
            can_select_building: new FormControl(false),
            show_legend_group_names: new FormControl(false),
            legend: new FormControl({}),
        }),
        css_variables: new FormControl({
            '--primary': '#c2185b',
            '--secondary': '#0a0d2e',
            '--success': '#43a047',
            '--pending': '#ffb300',
            '--error': '#e53935',
        }),
    });
}

export function generateGeneralSettingsForm() {
    return new FormGroup({
        menu: new FormControl([]),
    });
}

export function generateConciergeSettingsForm() {
    return new FormGroup({
        banner: new FormGroup({
            id: new FormControl(''),
            type: new FormControl('info'),
            content: new FormControl(''),
        }),
        features: new FormControl([
            'daily-calendar',
            'facilities',
            'catering',
            'visitors',
            'desks',
            'reports',
        ]),
        general: generateGeneralSettingsForm(),
        css_variables: new FormControl({
            '--primary': '#c2185b',
            '--secondary': '#0a0d2e',
            '--success': '#43a047',
            '--pending': '#ffb300',
            '--error': '#e53935',
        }),
    });
}

import type { HashMap } from './types';

export interface FrameMessage {
    type: 'backoffice';
    action: 'update' | 'metadata';
    name?: string;
    status?: 'success' | 'error';
    content: HashMap;
}

export function isChildFrame() {
    return window.parent !== window;
}

export function retrieveData<T = HashMap>(
    name: string,
    parent: boolean = false
): Promise<T> {
    return new Promise((resolve, reject) => {
        if (isChildFrame()) {
            const onMessage = (m) => {
                if (typeof m.data !== 'string') return;
                const parsed: FrameMessage = JSON.parse(m.data);
                if (parsed && parsed.type === 'backoffice') {
                    const data = parsed.content;
                    resolve(data as any);
                    window.removeEventListener('message', onMessage);
                }
            };
            window.addEventListener('message', onMessage);
            window.parent.postMessage(
                JSON.stringify({
                    type: 'backoffice',
                    action: 'load',
                    parent,
                    name,
                }),
                '*'
            );
        } else {
            reject('Application is not in an iFrame.');
        }
    });
}

export function sendMessage(msg: FrameMessage) {
    return new Promise<void>((resolve, reject) => {
        if (isChildFrame()) {
            window.parent.postMessage(JSON.stringify(msg), '*');
            const onMessage = (m) => {
                if (typeof m.data !== 'string') return;
                const parsed: FrameMessage = JSON.parse(m.data);
                if (parsed && parsed.type === 'backoffice') {
                    parsed.status === 'success' ? resolve() : reject();
                    window.removeEventListener('message', onMessage);
                }
            };
            window.addEventListener('message', onMessage);
        } else {
            reject('Application is not in an iFrame.');
        }
    });
}

import { randomString } from './general';
import type { HashMap } from './types';

export interface FrameMessage {
    id?: string;
    type: 'backoffice';
    action: 'update' | 'metadata' | 'resource';
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
            const onMessage = (m: any) => {
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

interface PromiseMethods {
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
}
const resolve_map: Record<string, PromiseMethods> = {};

export function onMessage(m: any) {
    if (typeof m.data !== 'string') return;
    const parsed: FrameMessage = JSON.parse(m.data);
    if (!parsed.id && resolve_map[parsed.id]) return;
    const { resolve, reject } = resolve_map[parsed.id];
    if (parsed && parsed.type === 'backoffice') {
        parsed.status === 'success' ? resolve(parsed.content) : reject(parsed);
        delete resolve_map[parsed.id];
    }
}
window.addEventListener('message', onMessage);

export function sendMessage(msg: FrameMessage) {
    return new Promise<any>((resolve, reject) => {
        if (isChildFrame()) {
            if (!msg.id) msg.id = randomString(8);
            window.parent.postMessage(JSON.stringify(msg), '*');
            resolve_map[msg.id] = { resolve, reject };
        } else {
            reject('Application is not in an iFrame.');
        }
    });
}

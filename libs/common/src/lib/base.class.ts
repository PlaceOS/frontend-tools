import { Injectable, signal } from '@angular/core';

interface Unsubscribable {
    unsubscribe: () => void;
}

@Injectable({
    providedIn: 'root',
})
export class BaseClass {
    /** Store for named timers */
    protected _timers: { [name: string]: number } = {};
    /** Store for named intervals */
    protected _intervals: { [name: string]: number } = {};
    /** Store for named subscription unsub callbacks */
    protected _subscriptions: {
        [name: string]: Unsubscribable | (() => void);
    } = {};
    /** Subject which stores the initialised state of the object */
    protected readonly _initialised = signal<boolean>(false);
    /** Signal of the initialised state of the object */
    public readonly initialised = this._initialised.asReadonly();

    /** Whether the object has been initialised */
    public get is_initialised(): boolean {
        return this._initialised();
    }

    public ngOnDestroy(): void {
        this.destroy();
    }

    protected destroy() {
        for (const key in this._timers) {
            if (this._timers.hasOwnProperty(key)) {
                this.clearTimeout(key);
            }
        }
        for (const key in this._intervals) {
            if (this._intervals.hasOwnProperty(key)) {
                this.clearInterval(key);
            }
        }
        for (const key in this._subscriptions) {
            if (this._subscriptions.hasOwnProperty(key)) {
                this.unsub(key);
            }
        }
    }

    /**
     * Creates a named timer
     * @param name Name of the timer
     * @param fn Callback function for the timer
     * @param delay Callback delay
     */
    protected timeout(name: string, fn: () => void, delay: number = 300) {
        if (name && fn && fn instanceof Function) {
            this.clearTimeout(name);
            this._timers[name] = <any>setTimeout(() => {
                fn();
                this._timers[name] = null as any;
            }, delay);
        } else {
            throw new Error(
                name
                    ? 'Cannot create named timeout without a name'
                    : 'Cannot create a timeout without a callback',
            );
        }
    }

    /**
     * Clears the named timer
     * @param name Timer name
     */
    protected clearTimeout(name: string) {
        if (this._timers[name]) {
            clearTimeout(this._timers[name]);
            this._timers[name] = null as any;
        }
    }

    /**
     * Creates a named interval
     * @param name Name of the interval
     * @param fn Callback function for the interval
     * @param delay Callback delay
     */
    protected interval(name: string, fn: () => void, delay: number = 300) {
        if (name && fn && fn instanceof Function) {
            this.clearInterval(name);
            this._intervals[name] = <any>setInterval(() => fn(), delay);
        } else {
            throw new Error(
                name
                    ? 'Cannot create named interval without a name'
                    : 'Cannot create a interval without a callback',
            );
        }
    }

    /**
     * Clears the named interval
     * @param name Timer name
     */
    protected clearInterval(name: string) {
        if (this._intervals[name]) {
            clearInterval(this._intervals[name]);
            this._intervals[name] = null as any;
        }
    }

    /**
     * Store named subscription
     * @param name Name of the subscription
     * @param unsub Unsubscribe callback or Subscription object
     */
    protected subscription(name: string, unsub: Unsubscribable | (() => void)) {
        this.unsub(name);
        this._subscriptions[name] = unsub;
    }

    /**
     * Call unsubscribe callback with the given name
     * @param name
     */
    protected unsub(name: string) {
        if (this._subscriptions && this._subscriptions[name]) {
            typeof this._subscriptions[name] !== 'function'
                ? (this._subscriptions[name] as Unsubscribable).unsubscribe()
                : (this._subscriptions[name] as any)();
            this._subscriptions[name] = null as any;
        }
    }
}

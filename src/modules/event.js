// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT license.


export default class Event {
    constructor() {}

    /**
     * Clears the event queue.
     */
    clear() {
        // Implementação aqui
    }

    /**
     * Returns an iterator for messages in the event queue.
     */
    poll() {
        // Implementação aqui
    }

    /**
     * Pump events into the event queue.
     * 
     * This is a low-level function, and is usually not called by the user, but by love.run.
     * 
     * Note that this does need to be called for any OS to think you're still running,
     * 
     * and if you want to handle OS-generated events at all (think callbacks).
     */
    pump() {
        // Implementação aqui
    }

    /**
     * Adds an event to the event queue.
     * 
     * From 0.10.0 onwards, you may pass an arbitrary amount of arguments with this function, though the default callbacks don't ever use more than six.
     */
    push(n, a, b, c, d, e, f, ...) {
        // Implementação aqui
    }

    /**
     * Adds the quit event to the queue.
     * 
     * The quit event is a signal for the event handler to close L├ûVE. It's possible to abort the exit process with the love.quit callback.
     */
    quit(exitstatus) {
        // Implementação aqui
    }

    /**
     * Like love.event.poll(), but blocks until there is an event in the queue.
     */
    wait() {
        // Implementação aqui
    }

}
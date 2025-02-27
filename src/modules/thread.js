// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT license.


export default class Thread {
    constructor() {}

    /**
     * Creates or retrieves a named thread channel.
     */
    getChannel(name) {
        // Implementação aqui
    }

    /**
     * Create a new unnamed thread channel.
     * 
     * One use for them is to pass new unnamed channels to other threads via Channel:push on a named channel.
     */
    newChannel() {
        // Implementação aqui
    }

    /**
     * Creates a new Thread from a filename, string or FileData object containing Lua code.
     */
    newThread(filename) {
        // Implementação aqui
    }

}
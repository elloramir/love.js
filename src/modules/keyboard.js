// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT license.


export default class Keyboard {
    constructor(project) {
        this.keyStates = new Map();

        window.addEventListener("keydown", (e) => {
            const key = Keyboard.mapIt(e.key);
            this.keyStates.set(key, true);
            project.love.keypressed(key);
        });

        window.addEventListener("keyup", (e) => {
            const key = Keyboard.mapIt(e.key);
            this.keyStates.set(key, false);
            project.love.keyreleased(key);
        });
    }

    static mapIt(jsKey) {
        switch(jsKey) {
        case " ": return "space"; break;
        case "ArrowLeft": return "left"; break;
        case "ArrowRight": return "right"; break;
        case "ArrowUp": return "up"; break;
        case "ArrowDown": return "down"; break;
        default: return jsKey.toLowerCase(); break;
        }
    }

    /**
     * Gets the key corresponding to the given hardware scancode.
     * 
     * Unlike key constants, Scancodes are keyboard layout-independent. For example the scancode 'w' will be generated if the key in the same place as the 'w' key on an American keyboard is pressed, no matter what the key is labelled or what the user's operating system settings are.
     * 
     * Scancodes are useful for creating default controls that have the same physical locations on on all systems.
     */
    getKeyFromScancode(scancode) {
        // Implementação aqui
    }

    /**
     * Gets the hardware scancode corresponding to the given key.
     * 
     * Unlike key constants, Scancodes are keyboard layout-independent. For example the scancode 'w' will be generated if the key in the same place as the 'w' key on an American keyboard is pressed, no matter what the key is labelled or what the user's operating system settings are.
     * 
     * Scancodes are useful for creating default controls that have the same physical locations on on all systems.
     */
    getScancodeFromKey(key) {
        // Implementação aqui
    }

    /**
     * Gets whether key repeat is enabled.
     */
    hasKeyRepeat() {
        // Implementação aqui
    }

    /**
     * Gets whether screen keyboard is supported.
     */
    hasScreenKeyboard() {
        // Implementação aqui
    }

    /**
     * Gets whether text input events are enabled.
     */
    hasTextInput() {
        // Implementação aqui
    }

    /**
     * Checks whether a certain key is down. Not to be confused with love.keypressed or love.keyreleased.
     */
    isDown(key) {
        return this.keyStates.get(key) || false;
    }

    /**
     * Checks whether the specified Scancodes are pressed. Not to be confused with love.keypressed or love.keyreleased.
     * 
     * Unlike regular KeyConstants, Scancodes are keyboard layout-independent. The scancode 'w' is used if the key in the same place as the 'w' key on an American keyboard is pressed, no matter what the key is labelled or what the user's operating system settings are.
     */
    isScancodeDown(scancode) {
        // Implementação aqui
    }

    /**
     * Enables or disables key repeat for love.keypressed. It is disabled by default.
     */
    setKeyRepeat(enable) {
        // Implementação aqui
    }

    /**
     * Enables or disables text input events. It is enabled by default on Windows, Mac, and Linux, and disabled by default on iOS and Android.
     * 
     * On touch devices, this shows the system's native on-screen keyboard when it's enabled.
     */
    setTextInput(enable) {
        // Implementação aqui
    }

}
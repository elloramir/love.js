// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT license.


export default class System {
    constructor() {}

    /**
     * Gets text from the clipboard.
     */
    getClipboardText() {
        // Implementação aqui
    }

    /**
     * Gets the current operating system. In general, L├ûVE abstracts away the need to know the current operating system, but there are a few cases where it can be useful (especially in combination with os.execute.)
     */
    getOS() {
        // Implementação aqui
    }

    /**
     * Gets information about the system's power supply.
     */
    getPowerInfo() {
        // Implementação aqui
    }

    /**
     * Gets the amount of logical processor in the system.
     */
    getProcessorCount() {
        // Implementação aqui
    }

    /**
     * Gets whether another application on the system is playing music in the background.
     * 
     * Currently this is implemented on iOS and Android, and will always return false on other operating systems. The t.audio.mixwithsystem flag in love.conf can be used to configure whether background audio / music from other apps should play while L├ûVE is open.
     */
    hasBackgroundMusic() {
        // Implementação aqui
    }

    /**
     * Opens a URL with the user's web or file browser.
     */
    openURL(url) {
        // Implementação aqui
    }

    /**
     * Puts text in the clipboard.
     */
    setClipboardText(text) {
        // Implementação aqui
    }

    /**
     * Causes the device to vibrate, if possible. Currently this will only work on Android and iOS devices that have a built-in vibration motor.
     */
    vibrate(seconds) {
        // Implementação aqui
    }

}
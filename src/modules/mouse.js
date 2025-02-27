// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT license.


export default class Mouse {
    constructor() {}

    /**
     * Gets the current Cursor.
     */
    getCursor() {
        // Implementação aqui
    }

    /**
     * Returns the current position of the mouse.
     */
    getPosition() {
        // Implementação aqui
    }

    /**
     * Gets whether relative mode is enabled for the mouse.
     * 
     * If relative mode is enabled, the cursor is hidden and doesn't move when the mouse does, but relative mouse motion events are still generated via love.mousemoved. This lets the mouse move in any direction indefinitely without the cursor getting stuck at the edges of the screen.
     * 
     * The reported position of the mouse is not updated while relative mode is enabled, even when relative mouse motion events are generated.
     */
    getRelativeMode() {
        // Implementação aqui
    }

    /**
     * Gets a Cursor object representing a system-native hardware cursor.
     * 
     * Hardware cursors are framerate-independent and work the same way as normal operating system cursors. Unlike drawing an image at the mouse's current coordinates, hardware cursors never have visible lag between when the mouse is moved and when the cursor position updates, even at low framerates.
     */
    getSystemCursor(ctype) {
        // Implementação aqui
    }

    /**
     * Returns the current x-position of the mouse.
     */
    getX() {
        // Implementação aqui
    }

    /**
     * Returns the current y-position of the mouse.
     */
    getY() {
        // Implementação aqui
    }

    /**
     * Gets whether cursor functionality is supported.
     * 
     * If it isn't supported, calling love.mouse.newCursor and love.mouse.getSystemCursor will cause an error. Mobile devices do not support cursors.
     */
    isCursorSupported() {
        // Implementação aqui
    }

    /**
     * Checks whether a certain mouse button is down.
     * 
     * This function does not detect mouse wheel scrolling; you must use the love.wheelmoved (or love.mousepressed in version 0.9.2 and older) callback for that.
     */
    isDown(button, ...) {
        // Implementação aqui
    }

    /**
     * Checks if the mouse is grabbed.
     */
    isGrabbed() {
        // Implementação aqui
    }

    /**
     * Checks if the cursor is visible.
     */
    isVisible() {
        // Implementação aqui
    }

    /**
     * Creates a new hardware Cursor object from an image file or ImageData.
     * 
     * Hardware cursors are framerate-independent and work the same way as normal operating system cursors. Unlike drawing an image at the mouse's current coordinates, hardware cursors never have visible lag between when the mouse is moved and when the cursor position updates, even at low framerates.
     * 
     * The hot spot is the point the operating system uses to determine what was clicked and at what position the mouse cursor is. For example, the normal arrow pointer normally has its hot spot at the top left of the image, but a crosshair cursor might have it in the middle.
     */
    newCursor(imageData, hotx, hoty) {
        // Implementação aqui
    }

    /**
     * Sets the current mouse cursor.
     */
    setCursor(cursor) {
        // Implementação aqui
    }

    /**
     * Grabs the mouse and confines it to the window.
     */
    setGrabbed(grab) {
        // Implementação aqui
    }

    /**
     * Sets the current position of the mouse. Non-integer values are floored.
     */
    setPosition(x, y) {
        // Implementação aqui
    }

    /**
     * Sets whether relative mode is enabled for the mouse.
     * 
     * When relative mode is enabled, the cursor is hidden and doesn't move when the mouse does, but relative mouse motion events are still generated via love.mousemoved. This lets the mouse move in any direction indefinitely without the cursor getting stuck at the edges of the screen.
     * 
     * The reported position of the mouse may not be updated while relative mode is enabled, even when relative mouse motion events are generated.
     */
    setRelativeMode(enable) {
        // Implementação aqui
    }

    /**
     * Sets the current visibility of the cursor.
     */
    setVisible(visible) {
        // Implementação aqui
    }

    /**
     * Sets the current X position of the mouse.
     * 
     * Non-integer values are floored.
     */
    setX(x) {
        // Implementação aqui
    }

    /**
     * Sets the current Y position of the mouse.
     * 
     * Non-integer values are floored.
     */
    setY(y) {
        // Implementação aqui
    }

}
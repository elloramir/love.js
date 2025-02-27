// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT license.


export default class Timer {
    constructor(project) {
        this.project = project;
    }

    /**
     * Returns the average delta time (seconds per frame) over the last second.
     */
    getAverageDelta() {
        // Implementação aqui
    }

    /**
     * Returns the time between the last two frames.
     */
    getDelta() {
        // Implementação aqui
    }

    /**
     * Returns the current frames per second.
     */
    getFPS() {
        // Implementação aqui
    }

    /**
     * Returns the value of a timer with an unspecified starting time.
     * 
     * This function should only be used to calculate differences between points in time, as the starting time of the timer is unknown.
     */
    getTime() {
        return this.project.pastTime;
    }

    /**
     * Pauses the current thread for the specified amount of time.
     */
    sleep(s) {
        // Implementação aqui
    }

    /**
     * Measures the time between two frames.
     * 
     * Calling this changes the return value of love.timer.getDelta.
     */
    step() {
        // Implementação aqui
    }

}
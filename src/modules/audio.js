// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT license.

import Source from "../models/source";


export default class Audio {
    constructor(project) {
        this.project = project;
    }

    /**
     * Gets a list of the names of the currently enabled effects.
     */
    getActiveEffects() {
        // Implementação aqui
    }

    /**
     * Gets the current number of simultaneously playing sources.
     */
    getActiveSourceCount() {
        // Implementação aqui
    }

    /**
     * Returns the distance attenuation model.
     */
    getDistanceModel() {
        // Implementação aqui
    }

    /**
     * Gets the current global scale factor for velocity-based doppler effects.
     */
    getDopplerScale() {
        // Implementação aqui
    }

    /**
     * Gets the settings associated with an effect.
     */
    getEffect(name) {
        // Implementação aqui
    }

    /**
     * Gets the maximum number of active effects supported by the system.
     */
    getMaxSceneEffects() {
        // Implementação aqui
    }

    /**
     * Gets the maximum number of active Effects in a single Source object, that the system can support.
     */
    getMaxSourceEffects() {
        // Implementação aqui
    }

    /**
     * Returns the orientation of the listener.
     */
    getOrientation() {
        // Implementação aqui
    }

    /**
     * Returns the position of the listener. Please note that positional audio only works for mono (i.e. non-stereo) sources.
     */
    getPosition() {
        // Implementação aqui
    }

    /**
     * Gets a list of RecordingDevices on the system.
     * 
     * The first device in the list is the user's default recording device. The list may be empty if there are no microphones connected to the system.
     * 
     * Audio recording is currently not supported on iOS.
     */
    getRecordingDevices() {
        // Implementação aqui
    }

    /**
     * Returns the velocity of the listener.
     */
    getVelocity() {
        // Implementação aqui
    }

    /**
     * Returns the master volume.
     */
    getVolume() {
        // Implementação aqui
    }

    /**
     * Gets whether audio effects are supported in the system.
     */
    isEffectsSupported() {
        // Implementação aqui
    }

    /**
     * Creates a new Source usable for real-time generated sound playback with Source:queue.
     */
    newQueueableSource(samplerate, bitdepth, channels, buffercount) {
        // Implementação aqui
    }

    /**
     * Creates a new Source from a filepath, File, Decoder or SoundData.
     * 
     * Sources created from SoundData are always static.
     */
    newSource(filename, type) {
        // Implementação aqui
        return new Source();
    }

    /**
     * Pauses specific or all currently played Sources.
     */
    pause(source, ...args) {
        // Implementação aqui
    }

    /**
     * Plays the specified Source.
     */
    play(source) {
        // Implementação aqui
    }

    /**
     * Sets the distance attenuation model.
     */
    setDistanceModel(model) {
        // Implementação aqui
    }

    /**
     * Sets a global scale factor for velocity-based doppler effects. The default scale value is 1.
     */
    setDopplerScale(scale) {
        // Implementação aqui
    }

    /**
     * Defines an effect that can be applied to a Source.
     * 
     * Not all system supports audio effects. Use love.audio.isEffectsSupported to check.
     */
    setEffect(name, settings) {
        // Implementação aqui
    }

    /**
     * Sets whether the system should mix the audio with the system's audio.
     */
    setMixWithSystem(mix) {
        // Implementação aqui
    }

    /**
     * Sets the orientation of the listener.
     */
    setOrientation(fx, fy, fz, ux, uy, uz) {
        // Implementação aqui
    }

    /**
     * Sets the position of the listener, which determines how sounds play.
     */
    setPosition(x, y, z) {
        // Implementação aqui
    }

    /**
     * Sets the velocity of the listener.
     */
    setVelocity(x, y, z) {
        // Implementação aqui
    }

    /**
     * Sets the master volume.
     */
    setVolume(volume) {
        // Implementação aqui
    }

    /**
     * Stops currently played sources.
     */
    stop(source) {
        // Implementação aqui
    }

}
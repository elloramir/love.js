// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT license.


export default class Sound {
    constructor() {}

    /**
     * Attempts to find a decoder for the encoded sound data in the specified file.
     */
    newDecoder(file, buffer) {
        // Implementação aqui
    }

    /**
     * Creates new SoundData from a filepath, File, or Decoder. It's also possible to create SoundData with a custom sample rate, channel and bit depth.
     * 
     * The sound data will be decoded to the memory in a raw format. It is recommended to create only short sounds like effects, as a 3 minute song uses 30 MB of memory this way.
     */
    newSoundData(filename) {
        // Implementação aqui
    }

}
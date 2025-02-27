// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT license.

import { createCanvas } from "../helpers.js";
import ImageData from "../models/imagedata.js";

export default class ImageModule {
    constructor(project) {
        this.project = project;
    }

    /**
     * Determines whether a file can be loaded as CompressedImageData.
     */
    isCompressed(filename) {
        // Implementação aqui
    }

    /**
     * Create a new CompressedImageData object from a compressed image file. L├ûVE supports several compressed texture formats, enumerated in the CompressedImageFormat page.
     */
    newCompressedData(filename) {
        // Implementação aqui
    }

    /**
     * Creates a new ImageData object.
     */
    newImageData(width, height) {
        if (typeof width === "string") {
            const filename = width;
            const data = this.project.getFile(filename);
            if (!data)
                throw "No data found for the image: " + filename;
            
            const canvas = createCanvas(data.width, data.height);
            const context = canvas.getContext("2d");
            context.drawImage(data, 0, 0);
            const pixels = context.getImageData(0, 0, data.width, data.height).data;
            const dataArray = new Uint8ClampedArray(pixels);

            return new ImageData(data.width, data.height, dataArray);
        }
        else {
            return new ImageData(width, height);
        }
    }

}
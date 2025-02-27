// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import { LuaMultiReturn } from "wasmoon";

export default
class ImageData {
    constructor(width, height, dataArray) {
        this.width = width;
        this.height = height;
        this.data = dataArray || new Uint8ClampedArray(width * height * 4);
    }

    getPixel(x, y) {
        const i = (y * this.width + x) * 4;
        const r = this.data[i + 0] / 255;
        const g = this.data[i + 1] / 255;
        const b = this.data[i + 2] / 255;
        const a = this.data[i + 3] / 255;

        return new LuaMultiReturn(r, g, b, a);
    }
};
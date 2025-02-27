// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import { LuaMultiReturn } from "wasmoon";
import { isPowerOf2 } from "../helpers.js"

export default
class ImageModel {
	constructor(gl, img, filter=gl.NEAREST) {
		this.id = gl.createTexture();
		this.width = img.width;
		this.height = img.height;

		const isBase2 = isPowerOf2(img.width * img.height);
		const wrapMode = isBase2 ? gl.REPEAT : gl.CLAMP_TO_EDGE;
		
		gl.bindTexture(gl.TEXTURE_2D, this.id);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapMode);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapMode);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

		if (isBase2) {
			gl.generateMipmap(gl.TEXTURE_2D);
		}
	}

	getHeight() {
		return this.height;
	}

	getWidth() {
		return this.width;
	}


	getDimensions() {
		return new LuaMultiReturn(this.width, this.height);
	}

	// static loadFromFile(file, gl) {
	// 	return new Promise((resolve, reject) => {
	// 		const img = new Image();
	// 		img.onload = () => {
	// 			resolve(new ImageModel(gl, img));
	// 		};
	// 		img.onerror = reject;
	// 		img.src = file;
	// 	});
	// }
};
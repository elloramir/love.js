// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

export default class CanvasModel {
	constructor(gl, width, height, filter = gl.LINEAR) {
		this.width = width;
		this.height = height;

		// Create a texture to render to
		this.id = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.id);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		// Set texture parameters
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		// Create a framebuffer object (FBO)
		this.framebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

		// Attach the texture to the FBO
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.id, 0);

		// Check if the framebuffer is complete
		if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
			console.error("Framebuffer is not complete");
			return null;
		}

		// Unbind the framebuffer to avoid accidental rendering to it
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	getWidth() {
		return this.width;
	}

	getHeight() {
		return this.height;
	}

	getDimensions() {
		throw "Sexo";
	}
}
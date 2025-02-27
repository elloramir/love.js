// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT license.

import { createWhitePixel } from "./helpers.js"
import { orthoMat4 } from "./modules/math.js"
import ImageModel from "./models/image.js"


export default
class Batcher {
	constructor(gl, maxQuads=1024) {
		this.gl = gl;
		this.screen = gl.canvas;

		this.vbo = this.gl.createBuffer();
		this.ibo = this.gl.createBuffer();

		this.vertices = new Float32Array(maxQuads * 4 * 7);
		this.maxQuads = maxQuads;
		this.currVert = 0;
		this.currQuad = 0;

		this.whitePixel = new ImageModel(this.gl, createWhitePixel());
		this.texture = null;
		this.shader = null;
		this.color = [1, 1, 1, 1];

		// Initialize stacks
		this.translateStack = [{ x: 0, y: 0 }];
		this.scaleStack = [{ x: 1, y: 1 }];
		this.rotationStack = [0];  // Angle in radians

		// Set orthographic projection matrix
		this.proj = orthoMat4(0, this.gl.canvas.width, this.gl.canvas.height, 0, -1, 1);

		// Setup index buffer
		const indices = new Uint16Array(maxQuads * 6);
		for (let i = 0, j = 0; i < indices.length; i += 6, j += 4) {
			indices[i + 0] = j + 0;
			indices[i + 1] = j + 1;
			indices[i + 2] = j + 2;
			indices[i + 3] = j + 0;
			indices[i + 4] = j + 2;
			indices[i + 5] = j + 3;
		}
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);

		this.currentFBO = null;
	}

	clear(r, g, b) {
		this.gl.clearColor(r, g, b, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	frame() {
		this.gl.enable(this.gl.BLEND);
		this.gl.disable(this.gl.CULL_FACE);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
		this.clear(0, 0, 0);

		// Reset transformations for this frame
		this.translateStack = [{ x: 0, y: 0 }];
		this.scaleStack = [{ x: 1, y: 1 }];
		this.rotationStack = [0];
	}

	flush() {
		if (this.currQuad === 0 || !this.texture || !this.shader) {
			return;
		}

		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.currentFBO);

		const aPosition = this.shader.getAttrib('a_position');
		const aTexcoords = this.shader.getAttrib('a_texcoords');
		const aColor = this.shader.getAttrib('a_color');

		if (aPosition !== null && aTexcoords !== null && aColor !== null) {
			this.gl.useProgram(this.shader.id);

			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);

			this.gl.enableVertexAttribArray(aPosition);
			this.gl.enableVertexAttribArray(aTexcoords);
			this.gl.enableVertexAttribArray(aColor);

			this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, false, 32, 0);
			this.gl.vertexAttribPointer(aTexcoords, 2, this.gl.FLOAT, false, 32, 8);
			this.gl.vertexAttribPointer(aColor, 4, this.gl.FLOAT, false, 32, 16);

			this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.id);
			this.gl.drawElements(this.gl.TRIANGLES, this.currQuad * 6, this.gl.UNSIGNED_SHORT, 0);

			this.currVert = 0;
			this.currQuad = 0;
		}

		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
	}

	setColor(r, g, b, a) {
		this.color[0] = r;
		this.color[1] = g;
		this.color[2] = b;
		this.color[3] = a;
	}

	setTexture(texture) {
		if (this.texture !== texture) {
			this.flush();
			this.texture = texture;
		}
	}

	setShader(shader) {
		if (this.shader !== shader) {
			this.flush();
			this.shader = shader;

			this.gl.useProgram(shader.id);
			this.gl.uniformMatrix4fv(shader.getUniform('u_proj'), false, this.proj);
		}
	}

	vertex(x, y, u, v, r, g, b, a) {
		this.vertices[this.currVert++] = x;
		this.vertices[this.currVert++] = y;
		this.vertices[this.currVert++] = u;
		this.vertices[this.currVert++] = v;
		this.vertices[this.currVert++] = r;
		this.vertices[this.currVert++] = g;
		this.vertices[this.currVert++] = b;
		this.vertices[this.currVert++] = a;
	}

	// Push the current transformation onto the stack
	push() {
		this.translateStack.push({ ...this.translateStack[this.translateStack.length - 1] });
		this.scaleStack.push({ ...this.scaleStack[this.scaleStack.length - 1] });
		this.rotationStack.push(this.rotationStack[this.rotationStack.length - 1]);
	}

	// Pop the last transformation from the stack
	pop() {
		this.translateStack.pop();
		this.scaleStack.pop();
		this.rotationStack.pop();
	}

	// Translate the current transformation
	translate(x, y) {
		const last = this.translateStack[this.translateStack.length - 1];
		last.x += x;
		last.y += y;
	}

	// Scale the current transformation
	scale(sx, sy) {
		const last = this.scaleStack[this.scaleStack.length - 1];
		last.x *= sx;
		last.y *= sy;
	}

	// Rotate the current transformation (in radians)
	rotate(angle) {
		this.rotationStack[this.rotationStack.length - 1] += angle;
	}

	applyTransform(x, y, rot, sx, sy) {
		// Get the last transformation state from the stacks
		const translate = this.translateStack[this.translateStack.length - 1];
		const scale = this.scaleStack[this.scaleStack.length - 1];
		const rotation = this.rotationStack[this.rotationStack.length - 1];

		// Apply translation
		x += translate.x;
		y += translate.y;

		// Apply scaling
		sx *= scale.x;
		sy *= scale.y;

		// Apply rotation
		const cos = Math.cos(rotation + rot);
		const sin = Math.sin(rotation + rot);

		return [x, y, cos, sin, sx, sy];
	}

	pushQuad(x, y, w, h, rot=0, sx=1, sy=1, px=0, py=0, u1=0, v1=0, u2=1, v2=1) {
		if (this.currQuad >= this.maxQuads) {
			this.flush();
		}

		const [newX, newY, cos, sin, scaleX, scaleY] = this.applyTransform(x, y, rot, sx, sy);

		w = w * scaleX;
		h = h * scaleY;

		const x1 = -px * w;
		const y1 = -py * h;
		const x2 = x1 + w;
		const y2 = y1;
		const x3 = x1 + w;
		const y3 = y1 + h;
		const x4 = x1;
		const y4 = y1 + h;

		const [r, g, b, a] = this.color;

		this.vertex(newX + x1 * cos - y1 * sin, newY + x1 * sin + y1 * cos, u1, v1, r, g, b, a);
		this.vertex(newX + x2 * cos - y2 * sin, newY + x2 * sin + y2 * cos, u2, v1, r, g, b, a);
		this.vertex(newX + x3 * cos - y3 * sin, newY + x3 * sin + y3 * cos, u2, v2, r, g, b, a);
		this.vertex(newX + x4 * cos - y4 * sin, newY + x4 * sin + y4 * cos, u1, v2, r, g, b, a);

		this.currQuad++;
	}

	drawTex(tex, x, y, rot, sx, sy, px, py, u1, v1, u2, v2) {
		this.setTexture(tex);
		this.pushQuad(x, y, tex.width, tex.height, rot, sx, sy, px, py, u1, v1, u2, v2);
	}

	drawStr(font, text, x, y) {
		const begin = x;
		const fallback = font.getGlyph("?");

		this.setTexture(font.atlas);
		for (let i = 0; i < text.length; i++) {
			switch(text[i]) {
				case "\n":
				case "\r": {
					y += font.size;
					x = begin;
					continue;
				}
				default: {
					const glyph = font.getGlyph(text[i]) || fallback;
					this.pushQuad(x, y, glyph.width, glyph.height, 0, 1, 1, 0, 0, glyph.u1, glyph.v1, glyph.u2, glyph.v2);
					x += glyph.advanceX;
				}
			}
		}
	}

	fillRect(x, y, w, h, rot) {
		this.setTexture(this.whitePixel);
		this.pushQuad(x, y, w, h, rot);
	}

	setFrameBuffer(fbo) {
		if (this.currentFBO !== fbo) {
			this.flush();
			this.currentFBO = fbo;
		}
	}
};

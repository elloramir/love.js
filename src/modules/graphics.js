// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import Font from "../models/font.js";
import ImageModel from "../models/image.js";
import Quad from "../models/quad.js";
import { imageLoader } from "../loaders.js";

export default
class Graphics {
	constructor(project) {
		this.project = project;
		this.width = project.canvas.width;
		this.height = project.canvas.height;
		this.batcher = project.batcher;
		this.defaultFont = new Font(project.gl, "Arial", 20, false);
	}

	setColor(r, g, b, a=1) {
		this.batcher.setColor(r, g, b, a);
	}

	print(str, x, y) {
		this.batcher.drawStr(this.defaultFont, str, x, y);
	}

	// @todo: Segments, round corner and mode
	rectangle(mode, x, y, width, height, rx, ry, segments) {
		this.batcher.fillRect(x, y, width, height);
	}

	// @todo: Real circle drawing
	circle(mode, x, y, radius) {
		this.batcher.fillRect(x-radius, y-radius, radius*2, radius*2);
	}


	newImage(filename) {
		console.log(filename)
	    const data = this.project.getFile(filename);
		if (!data)
			throw "No data found for the image: " + filename;

		const model = new ImageModel(this.project.gl, data);
		
		return model;
	}

	getDefaultFilter() {return"nearest";}
	setLineStyle() {}
	setFont() {}
	setDefaultFilter() {}
	setCanvas() {}
	clear() {}
	push() {}
	pop() {}
	translate() {}
	scale() {}

	getHeight() { return this.height; }
	getWidth() { return this.width; }

	getDimensions() { return 0 }

	newQuad() {
		return new Quad();
	}

	newFont() {
		return {};
	}

	newImageFont() {
		return {};
	}

	newShader() {
		return {};
	}

	newCanvas() {
		return {};
	}

	draw(tex, x=0, y=0, r=0, sx=1, sy=1, ox, oy, kx, ky ) {
		this.batcher.drawTex(tex, x, y, 0, 1, 1, 0, 0);
		// tex, x, y, rot, sx, sy, px, py, u1, v1, u2, v2
	}
}
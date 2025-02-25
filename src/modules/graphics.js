// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

export default
class Graphics {
	constructor(project) {
		this.batcher = project.batcher;
		this.color = [1, 1, 1, 1];
	}

	setColor(r, g, b, a=1) {
		this.batcher.setColor(r, g, b, a);
	}

	print() {
		
	}

	// @todo: Segments, round corner and mode
	rectangle(mode, x, y, width, height, rx, ry, segments) {
		this.batcher.fillRect(x, y, width, height);
	}

	// @todo: Real circle drawing
	circle(mode, x, y, radius) {
		this.batcher.fillRect(x-radius, y-radius, radius*2, radius*2);
	}
}
// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

export default
class Window {
	constructor(project) {
		this.width = project.canvas.width;
		this.height = project.canvas.height;
	}

	setTitle(title) {
		document.title = title;
	}

	setMode() {}

	getWidth() {
		return this.width;
	}

	getHeight() {
		return this.height;
	}

	getDimensions() {
		// return [this.width, this.height];
	}
}
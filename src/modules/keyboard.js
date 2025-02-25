// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

export default
class Keyboard {
	 constructor(project) {
		this.keyStates = new Map();

		window.addEventListener("keydown", (e) => {
			const key = Keyboard.mapIt(e.key);
			this.keyStates.set(key, true);
			project.love.keypressed(key);
		});

		window.addEventListener("keyup", (e) => {
			const key = Keyboard.mapIt(e.key);
			this.keyStates.set(key, false);
			project.love.keyreleased(key);
		});
	}

	static mapIt(jsKey) {
		switch(jsKey) {
		case " ": return "space"; break;
		case "ArrowLeft": return "left"; break;
		case "ArrowRight": return "right"; break;
		case "ArrowUp": return "up"; break;
		case "ArrowDown": return "down"; break;
		default: return jsKey.toLowerCase(); break;
		}
	}

	isDown(key) {
		return this.keyStates.get(key) || false;
	}
}
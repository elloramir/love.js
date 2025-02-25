// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import JSZip from "jszip";
import { LuaFactory } from "wasmoon";
import { createCanvas } from "./helpers.js";
import Batcher from "./batcher.js";
import luaRequire from "./lua/require.lua";
import luaNamespace from "./lua/namespace.lua";
import defaultFrag from "./shaders/default.frag.glsl";
import defaultVert from "./shaders/default.vert.glsl";
import Graphics from "./modules/graphics.js";
import MathModule from "./modules/math.js";
import Window from "./modules/window.js";
import Keyboard from "./modules/keyboard.js";
import Shader from "./models/shader.js";

export default
class Project {
	constructor(files, virtualMachine) {
		this.files = files;
		this.lua = virtualMachine;
		this.pastTime = 0;
		this.deltaTime = 0;
		this.targetFPS = 60;
		this.timeCAP = 1/this.targetFPS;

		this.canvas = createCanvas(800, 600);
		this.gl = this.canvas.getContext("webgl");
		this.batcher = new Batcher(this.gl);

		this.defaultShader = new Shader(this.gl,
			defaultVert,
			defaultFrag);

		// Setup enviorment
		this.lua.doString(luaRequire);
		this.lua.doString(luaNamespace);

		// Setup our javascript bindings
		this.lua.global.set("__keyboard", new Keyboard(this));
		this.lua.global.set("__graphics", new Graphics(this));
		this.lua.global.set("__math", MathModule);
		this.lua.global.set("__window", new Window(this));

		// User setup (if it have one)
		if (files["conf.lua"])
			this.lua.doString(files["conf.lua"]);
		
		// Finaly boot the entry
		this.lua.doString(files["main.lua"]);

		// Save global namespace reference for love
		this.love = this.lua.global.get("love");
		this.love.load();
	}

	static async loadFromFile(filename) {
		const response = await fetch(filename);

		if (!response.ok)
			throw `Could not found project: ${filename}`;

		const blob = await response.blob();
		const zip = await JSZip.loadAsync(blob);

		// Extract files from .zip/.love
		const files = {};
		for (const fileName of Object.keys(zip.files)) {
			if (!zip.files[fileName].dir) {
				// @todo: Check first the mimetype before consider string
				files[fileName] = await zip.files[fileName].async("string");
			}
		}

		if (!files["main.lua"])
			throw "No entry point was found";

		// Create lua VM
		const factory = new LuaFactory();
		const virtualMachine = await factory.createEngine();

		return new Project(files, virtualMachine);
	}

	mainLoop(currentTime=0) {
		this.deltaTime += (currentTime - this.pastTime) / 1000;
		this.pastTime = currentTime;

		while (this.deltaTime >= this.timeCAP) {
			// Game tick goes here
			this.love.update(this.deltaTime);
			this.deltaTime -= this.timeCAP;
		}

		this.batcher.frame();
		this.batcher.setShader(this.defaultShader);
		this.love.draw();
		this.batcher.flush();

		requestAnimationFrame(this.mainLoop.bind(this));
	}
}
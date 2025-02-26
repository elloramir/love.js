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
import Audio from "./modules/audio.js";
import Window from "./modules/window.js";
import FileSystem from "./modules/filesystem.js";
import Timer from "./modules/timer.js";
import Physics from "./modules/physics.js";
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

		this.setup();
	}

	async setup() {
		// Setup our javascript bindings
		await this.lua.global.set("__getScript", this.getString.bind(this));
		await this.lua.global.set("__physics", new Physics(this));
		await this.lua.global.set("__audio", new Audio(this));
		await this.lua.global.set("__window", new Window(this));
		await this.lua.global.set("__keyboard", new Keyboard(this));
		await this.lua.global.set("__graphics", new Graphics(this));
		await this.lua.global.set("__filesystem", new FileSystem(this));
		await this.lua.global.set("__timer", new Timer(this));
		await this.lua.global.set("__math", MathModule);

		// Setup enviorment
		await this.lua.doString(luaRequire);
		await this.lua.doString(luaNamespace);

		// User setup (if it have one)
		if (this.files["conf.lua"])
			await this.lua.doString(this.getString("conf.lua"));
		
		// Finaly boot the entry
		await this.lua.doString(this.getString("main.lua"));

		// Save global namespace reference for love
		this.love = await this.lua.global.get("love");
		this.love.load();

		// Boot game loop
		this.mainLoop();
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
				// Considerer all files as uint8array
				files[fileName] = await zip.files[fileName].async("uint8array");
			}
		}

		if (!files["main.lua"])
			throw "No entry point was found";

		// Create lua VM
		const factory = new LuaFactory();
		const virtualMachine = await factory.createEngine();

		return new Project(files, virtualMachine);
	}

	getFile(filename) {
		return this.files[filename];
	}

	getString(filename) {
		const arr = this.files[filename];
		const str = new TextDecoder("utf-8").decode(arr);

		return str;
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
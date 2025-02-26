// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT license

import JSZip from "jszip";
import { LuaFactory } from "wasmoon";
import { createCanvas } from "./helpers.js";
import { imageLoader } from "./loaders.js";
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

export default class Project {
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
		this.defaultShader = new Shader(this.gl, defaultVert, defaultFrag);

		this.setup();
	}

	async setup() {
		// Preload all content
		for (const [key, content] of this.files) {
			this.files[key] = await content;
		}

		// Setup JS bindings
		await this.lua.global.set("__getScript", this.getString.bind(this));
		await this.lua.global.set("__physics", new Physics(this));
		await this.lua.global.set("__audio", new Audio(this));
		await this.lua.global.set("__window", new Window(this));
		await this.lua.global.set("__keyboard", new Keyboard(this));
		await this.lua.global.set("__graphics", new Graphics(this));
		await this.lua.global.set("__filesystem", new FileSystem(this));
		await this.lua.global.set("__timer", new Timer(this));
		await this.lua.global.set("__math", MathModule);

		// Setup environment
		await this.lua.doString(luaRequire);
		await this.lua.doString(luaNamespace);

		// Load config if available
		if (this.files.get("conf.lua"))
			await this.lua.doString(this.getString("conf.lua"));
		
		// Boot the entry point
		await this.lua.doString(this.getString("main.lua"));

		// Get love reference
		this.love = await this.lua.global.get("love");
		this.love.load();

		// Start game loop
		this.mainLoop();
	}

	static async loadFromFile(filename) {
		const response = await fetch(filename);
		if (!response.ok)
			throw `Could not find project: ${filename}`;

		const blob = await response.blob();
		const zip = await JSZip.loadAsync(blob);

		// Extract files from .zip/.love
		const files = new Map();
		const imageExtensions = ['png', 'jpg', 'jpeg', 'gif'];

		for (const zipFilename of Object.keys(zip.files)) {
			if (zip.files[zipFilename].dir) continue;

			const fileData = await zip.files[zipFilename].async("uint8array");
			const extension = zipFilename.split('.').pop().toLowerCase();
			
			// Process images differently, other files as binary
			const media = imageExtensions.includes(extension) 
				? imageLoader(fileData) 
				: Promise.resolve(fileData);
				
			files.set(zipFilename, media);
		}

		if (!files.get("main.lua"))
			throw "No entry point found";

		// Create Lua VM
		const virtualMachine = await new LuaFactory().createEngine();
		return new Project(files, virtualMachine);
	}

	getFile(filename) {
		return this.files[filename];
	}

	getString(filename) {
		const arr = this.files[filename];
		return new TextDecoder("utf-8").decode(arr);
	}

	mainLoop(currentTime = 0) {
		this.deltaTime = (currentTime - this.pastTime) / 1000;
		this.pastTime = currentTime;

		this.love.update(this.deltaTime);
		
		this.batcher.frame();
		this.batcher.setShader(this.defaultShader);
		this.love.draw();
		this.batcher.flush();

		requestAnimationFrame(this.mainLoop.bind(this));
	}
}
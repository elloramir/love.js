// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT license

import JSZip from "jszip";
import { LuaFactory } from "wasmoon";
import { createCanvas } from "./helpers.js";
import { imageLoader, soundLoader } from "./loaders.js";

import Batcher from "./batcher.js";
import Font from "./models/font.js";
import Shader from "./models/shader.js";

import luaLove from "./lua/love.lua";
import luaPolyfill from "./lua/polyfill.lua";

import defaultFrag from "./shaders/default.frag.glsl";
import defaultVert from "./shaders/default.vert.glsl";

import ImageModule from "./modules/image.js";
import Graphics from "./modules/graphics.js";
import MathModule from "./modules/math.js";
import Audio from "./modules/audio.js";
import Window from "./modules/window.js";
import FileSystem from "./modules/filesystem.js";
import Timer from "./modules/timer.js";
import Physics from "./modules/physics.js";
import Keyboard from "./modules/keyboard.js";
import System from "./modules/system.js";


export default class Project {
	constructor(files, virtualMachine, factory) {
		this.files = files;
		this.factory = factory;
		this.lua = virtualMachine;
		this.pastTime = 0;
		this.deltaTime = 0;
		this.isPlaying = false;

		this.canvas = createCanvas(800, 600, true);
		this.gl = this.canvas.getContext("webgl");
		this.batcher = new Batcher(this.gl);
		this.defaultShader = new Shader(this.gl, defaultVert, defaultFrag);
        this.defaultFont = new Font(this.gl, "Arial", 20, false);

		// First user interaction (audio)
		this.batcher.frame();
		this.batcher.setShader(this.defaultShader);
		this.batcher.setColor(1, 1, 1, 1);
		this.batcher.drawStr(this.defaultFont,
			"click here to start game",
			this.canvas.width/2 - 150,
			this.canvas.height/2);
		this.batcher.flush();

		// Start game loop
		this.canvas.addEventListener("click", () => {
			this.setup();
		}, {
			once: true
		});
	}

	async setup() {
		// Preload all content
		for (const [key, content] of this.files) {
			this.files[key] = await content;

			// Mount lua files
			if (key.endsWith(".lua")) {
				this.factory.mountFile(key, this.getString(key));
			}
		}

		// Setup JS bindings
		await this.lua.global.set("__image", new ImageModule(this));
		await this.lua.global.set("__physics", new Physics(this));
		await this.lua.global.set("__audio", new Audio(this));
		await this.lua.global.set("__system", new System(this));
		await this.lua.global.set("__window", new Window(this));
		await this.lua.global.set("__keyboard", new Keyboard(this));
		await this.lua.global.set("__graphics", new Graphics(this));
		await this.lua.global.set("__filesystem", new FileSystem(this));
		await this.lua.global.set("__timer", new Timer(this));
		await this.lua.global.set("__math", new MathModule(this));

		// Setup environment
		await this.lua.doString(luaLove);
		await this.lua.doString(luaPolyfill);

		// Load config if available
		if (this.files.get("conf.lua"))
			await this.lua.doString(this.getString("conf.lua"));
		
		// Boot the entry point
		await this.lua.doString(this.getString("main.lua"));

		// Get love reference
		this.love = await this.lua.global.get("love");

		// Setup stuff based on config
		this.love.conf(this.love.configs);
		this.canvas.width = this.love.configs.window.width;
		this.canvas.height = this.love.configs.window.height;

		// Start game
		this.love.load();
		this.play();
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
		const soundExtensions = ['mp3', 'wav', 'ogg'];

		for (const zipFilename of Object.keys(zip.files)) {
			if (zip.files[zipFilename].dir) continue;

			const fileData = zip.files[zipFilename].async("uint8array");
			const extension = zipFilename.split('.').pop().toLowerCase();

			// Process media files with their appropriate loaders
			let media;
			if (imageExtensions.includes(extension)) {
				media = imageLoader(fileData);
			} else if (soundExtensions.includes(extension)) {
				media = soundLoader(fileData);
			} else {
				media = fileData;
			}
			  
			files.set(zipFilename, media);
		}

		if (!files.get("main.lua"))
			throw "No entry point found";

		// Create Lua VM
		const factory = new LuaFactory();
		const virtualMachine = await factory.createEngine();

		return new Project(files, virtualMachine, factory);
	}

	getFile(filename) {
		return this.files[filename];
	}

	getString(filename) {
		const arr = this.files[filename];
		if (!arr) return null;
		return new TextDecoder("utf-8").decode(arr);
	}

	mainLoop(currentTime = 0) {
		if (!this.isPlaying)
			return;

		this.deltaTime = (currentTime - this.pastTime) / 1000;
		this.pastTime = currentTime;

		this.love.update(this.deltaTime);
		
		this.batcher.frame();
		this.batcher.setShader(this.defaultShader);
		this.love.draw();
		this.batcher.flush();

		requestAnimationFrame(this.mainLoop.bind(this));
	}

	stop() {
		this.isPlaying = false;
	}

	play() {
		this.isPlaying = true;
		requestAnimationFrame(this.mainLoop.bind(this));
	}

	exit() {
		this.love?.audio.clearAll();
		this.stop();
	}
}
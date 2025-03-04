// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT license

import JSZip from "jszip";
import * as luainjs from "./parser";
import { createCanvas } from "./helpers.js";
import { imageLoader, soundLoader, fontLoader } from "./loaders.js";

import Batcher from "./batcher.js";
import Font from "./models/font.js";
import Shader from "./models/shader.js";

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
	constructor(files, luaEnv) {
		this.files = files;
		this.luaEnv = luaEnv;
		this.pastTime = 0;
		this.deltaTime = 0;
		this.isPlaying = false;
		this.ticks = 0;
		this.fps = 0;
		this.accumulator = 0;

		this.canvas = createCanvas(800, 600, true);
		this.gl = this.canvas.getContext("webgl");
		this.batcher = new Batcher(this.gl);
		this.defaultShader = new Shader(this.gl, defaultVert, defaultFrag);
		this.defaultFont = new Font(this.gl, "Arial", 20, false);

		this.setup();
	}

	async setup() {
		// Preload all content
		for (const [key, content] of this.files)
			this.files.set(key, await content);

		// const loadString = (filename) => {
		// 	const arr = this.files.get(filename);
		// 	if (!arr) return null;
		// 	let content = new TextDecoder("utf-8").decode(arr);
		// 	return content.replace(/[^\x00-\x7F]/g, '');
		// };

		const Module = (cls) => new luainjs.Table(new cls(this));

		const love = new luainjs.Table({
			image:       Module(ImageModule),
			physics:     Module(Physics),
			audio:       Module(Audio),
			system:      Module(System),
			window:      Module(Window),
			keyboard:    Module(Keyboard),
			graphics:    Module(Graphics),
			filesystem:  Module(FileSystem),
			timer:       Module(Timer),
			math:        Module(MathModule),

			mouse: new luainjs.Table({
				setVisible: () => {},
				getPosition: () => [0, 0],
				isDown: () => false,
			}),


			load: () => {},
			update: () => {},
			draw: () => {},
			keypressed: () => {},
			keyreleased: () => {},
		});

		const sanitize = (filename, a, b, c) => {
			if (filename.startsWith("./"))
				filename = filename.slice(2);
			if (filename.endsWith(".lua"))
				filename = filename.replace(/\./g, "/").replace("/lua", ".lua");
			return filename;
		};

		const luaEnv = luainjs.createEnv({
			fileExists: (p) => this.files.has(sanitize(p)),
			loadFile: (p) => this.getString(sanitize(p)),
		});

		this.luaEnv = luaEnv;
		luaEnv.loadLib("love", love);
		luaEnv.loadLib("unpack", 
			require("./parser/lib/table").libTable.strValues.unpack);

		const luaScript = luaEnv.parse(this.getString("main.lua"));
		luaScript.exec();

		love.strValues.load();
		this.love = love.strValues;
		this.play();
	}

	mainLoop(currentTime = 0) {
		if (!this.isPlaying) return;

		this.deltaTime = (currentTime - this.pastTime) / 1000;
		this.pastTime = currentTime;
		this.accumulator += this.deltaTime;
		this.ticks++;

		if (this.accumulator > 1) {
			this.fps = this.ticks;
			this.ticks = 0;
			this.accumulator = 0;
		}

		this.love.update(this.deltaTime);

		this.batcher.frame();
		this.batcher.setShader(this.defaultShader);
		this.batcher.clear(0, 0, 0);
		this.love.draw();
		this.batcher.flush();

		requestAnimationFrame(this.mainLoop.bind(this));
	}

	play() {
		this.isPlaying = true;
		requestAnimationFrame(this.mainLoop.bind(this));
	}

	stop() {
		this.isPlaying = false;
	}

	getFile(filename) {
		return this.files.get(filename);
	}

	getString(filename) {
		const arr = this.files.get(filename);
		if (!arr) return null;
		return new TextDecoder("utf-8").decode(arr)	;
	}

	static async loadFromFile(filename) {
		const response = await fetch(filename);
		if (!response.ok) throw `Could not find project: ${filename}`;

		const blob = await response.blob();
		const zip = await JSZip.loadAsync(blob);
		const files = new Map();

		// Extract files from .zip/.love
		const imageExtensions = ['png', 'jpg', 'jpeg', 'gif'];
		const soundExtensions = ['mp3', 'wav', 'ogg'];
		const fontExtensions  = ['ttf', 'otf'];

		for (const zipFilename of Object.keys(zip.files)) {
			if (zip.files[zipFilename].dir) continue;

			const fileData = zip.files[zipFilename].async("uint8array");
			const extension = zipFilename.split('.').pop().toLowerCase();

			let media;
			if (imageExtensions.includes(extension)) {
				media = imageLoader(fileData);
			} else if (soundExtensions.includes(extension)) {
				media = soundLoader(fileData);
			} else if (fontExtensions.includes(extension)) {
				const fontName = zipFilename.split('/').pop().split('.')[0];
				media = fontLoader(fileData, fontName);
			} else {
				media = fileData;
			}

			files.set(zipFilename, media);
		}

		if (!files.get("main.lua")) throw "No entry point found";
		return new Project(files);
	}
}

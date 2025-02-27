// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import { uuid, createCanvas, sanitizeFilename } from "../helpers.js"
import ImageModel from "./image.js"

// @todo: It only works (barely) for pixel art fonts for now.
// It could be improved in the future, but for now, it's okay.
export default
class Font {
	static ASCII =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		"abcdefghijklmnopqrstuvwxyz" +
		"0123456789!@#$%^&*()_-+=<>?/\\.,;:[]{}| ";
	static UNICODE =
		"ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĨĩĪīĬĭĮįİıĲĳĴĵĶķĸ" +
		"ĹĺĻļĽľŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŕŖŗŘřŚśŜŝŞşŠšŢţŤťŨũŪūŬŭŮůŰűŲųŴŵŶŷŸ" +
		"ŹźŻżŽža!ö\"#$%&'()*+,-./0123456789:;<=>?@" +
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~" +
		"ŠšŒœŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ" +
		"®™£´~^ ";

	constructor(gl, fontName, size, isLowscale=true, glyphset=Font.UNICODE) {
		this.gl = gl;
		this.fontName = fontName;
		this.glyphs = new Map();
		this.size = size;
		this.glyphset = glyphset;
		this.isLowscale = isLowscale;
		this.generateAtlas();
	}
	
	generateAtlas() {
		// Increase the atlas size to avoid overlapping
		const atlasWidth = 1024;
		const atlasHeight = 1024;
		const canvas = createCanvas(atlasWidth, atlasHeight, this.isLowscale);
		const ctx = canvas.getContext("2d");
		
		// Increase padding to prevent character bleeding
		const padding = 4; // Increased padding to prevent bleeding
		const maxHeight = this.size + padding * 2;
		
		// Clear the canvas with a transparent color to avoid residues
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		// Configuration to render our glyph set
		ctx.fillStyle = "white";
		ctx.font = `${this.size}px ${this.fontName}`;
		ctx.textBaseline = "top"; // Ensuring vertical alignment consistency
		
		let x = padding;
		let y = padding;
		const lineHeight = this.size + padding * 2;
		
		this.glyphset.split("").forEach(char => {
			const metrics = ctx.measureText(char);
			// Calculate the actual character width
			const charWidth = Math.ceil(metrics.width) + padding * 2;
			
			// If there's not enough space on the current line, move to the next
			if (x + charWidth > atlasWidth - padding) {
				x = padding;
				y += lineHeight;
			}
			
			// Clear the specific area for this character completely
			ctx.clearRect(x - padding, y - padding, charWidth + padding, lineHeight + padding);
			
			// Draw the character centered in its area
			ctx.fillText(char, x, y);
			
			// Save metrics for later use
			this.glyphs.set(char, {
				width: metrics.width,
				height: this.size,
				advanceX: metrics.width + padding,
				// UV coordinates with safe margins to prevent bleeding
				u1: (x) / atlasWidth,
				v1: y / atlasHeight,
				u2: (x + metrics.width) / atlasWidth,
				v2: (y + this.size) / atlasHeight
			});
			
			// Move to the next character with additional padding
			x += charWidth;
		});
		
		// Apply sharp edge preservation if necessary
		if (this.isLowscale) {
			this.preserveCrispEdges(canvas, 0.8); // Adjusted threshold for better edge detection
		}
		
		this.atlas = new ImageModel(this.gl, canvas);
	}
	
	// Improved sharp edge preservation function
	preserveCrispEdges(canvas, threshold) {
		const ctx = canvas.getContext("2d");
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const data = imageData.data;
		
		// First step: Detect and clear low-opacity areas
		for (let i = 0; i < data.length; i += 4) {
			const alpha = data[i + 3] / 255;
			
			if (alpha < threshold) {
				// Completely clear low-opacity pixels
				data[i + 0] = 0;
				data[i + 1] = 0;
				data[i + 2] = 0;
				data[i + 3] = 0;
			} else {
				// Maximize opacity for pixels above the threshold
				data[i + 0] = 255;
				data[i + 1] = 255;
				data[i + 2] = 255;
				data[i + 3] = 255;
			}
		}
		
		ctx.putImageData(imageData, 0, 0);
	}
	
	getGlyph(char) {
		return this.glyphs.get(char);
	}
	
	static async loadFromFile(gl, file, size) {
		const name = sanitizeFilename(file);
		const font = new FontFace(name, `url(${file})`);
		
		return new Promise(async (resolve, reject) => {
			try {
				await font.load();
				document.fonts.add(font);
				resolve(new Font(gl, name, size));
			} catch (error) {
				reject(error);
			}
		});
	}
}

// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

export function createCanvas(width, height, antialising=false) {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;

	if (!antialising) {
		canvas.style = "image-rendering: pixelated;";
	}

	return canvas;
}

export function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

export function createWhitePixel() {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	canvas.width = 1;
	canvas.height = 1;

	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, 1, 1);

	return canvas;
}

export function unorderedRemove(array, index) {
	if (index > 0 && index < array.length) {
		array[index] = array[array.length - 1];
		array.pop();
	}
}

export function random(min, max) {
	return Math.floor(Math.random()*max+min);
}

export function uuid(size = 10) {
	let uuid = "";
	for (let i = 0; i < size; i++) {
		const rand = random(0, 62);
		const code =
			rand < 10 ? 48 + rand :      // ASCII 48 ('0')
			rand < 36 ? 65 + rand - 10 : // ASCII 65 ('A')
			97 + rand - 36;              // ASCII 97 ('a')
		uuid += String.fromCharCode(code);
	}
	return uuid;
}

export async function wait(seconds) {
	return new Promise((resolve) => setTimeout(resolve, seconds*1000));
}

export function sanitizeFilename(fontPath) {
	const fileName = fontPath.split('/').pop().split('.').slice(0, -1).join('.');
	const sanitized = fileName.replace(/[_\.]+/g, ' ');

	return sanitized;
};
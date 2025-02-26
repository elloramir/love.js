// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by an MIT
// license that can be found in the LICENSE file.

import pako from 'pako';


export function imageLoader(d) {
	let width, height, pixels;
	
	// Check if we have a valid PNG file
	if (d[0] === 0x89 && d[1] === 0x50 && d[2] === 0x4E && d[3] === 0x47) {
		try {
			// Reading the image dimensions from the header
			width = (d[16] << 24) | (d[17] << 16) | (d[18] << 8) | d[19];
			height = (d[20] << 24) | (d[21] << 16) | (d[22] << 8) | d[23];
			
			// Arrays to store compressed data
			let compressedData = [];
			let currentPos = 8; // Skip the initial header
			
			// Loop through PNG chunks
			while (currentPos < d.length) {
				// Chunk size
				const chunkLength = (d[currentPos] << 24) | (d[currentPos + 1] << 16) | 
								   (d[currentPos + 2] << 8) | d[currentPos + 3];
				currentPos += 4;
				
				// Chunk type (IHDR, IDAT, IEND, etc.)
				const chunkType = String.fromCharCode(d[currentPos], d[currentPos + 1], 
													 d[currentPos + 2], d[currentPos + 3]);
				currentPos += 4;
				
				// Process only IDAT chunks (image data)
				if (chunkType === 'IDAT') {
					// Extract data from this chunk
					for (let i = 0; i < chunkLength; i++) {
						compressedData.push(d[currentPos + i]);
					}
				}
				
				// Move to the next chunk (+ 4 bytes for CRC)
				currentPos += chunkLength + 4;
				
				// Exit loop if we reach the end chunk (IEND)
				if (chunkType === 'IEND') {
					break;
				}
				
				// Safety check to avoid infinite loops
				if (currentPos >= d.length) {
					console.warn("Unexpected end of data");
					break;
				}
			}
			
			// Decompress data using pako.js
			const decompressedData = pako.inflate(new Uint8Array(compressedData));
			
			// Process decompressed data
			pixels = new Uint8Array(width * height * 4);
			let pixelIndex = 0;
			let dataIndex = 0;
			
			// For each row of the image
			for (let y = 0; y < height; y++) {
				// Skip the filter byte at the beginning of each row
				const filterType = decompressedData[dataIndex++];
				
				// Process pixels in the row
				for (let x = 0; x < width; x++) {
					// Assuming RGBA format, 4 bytes per pixel
					pixels[pixelIndex++] = decompressedData[dataIndex++]; // R
					pixels[pixelIndex++] = decompressedData[dataIndex++]; // G
					pixels[pixelIndex++] = decompressedData[dataIndex++]; // B
					
					// If we have an alpha channel
					if (dataIndex < decompressedData.length) {
						pixels[pixelIndex++] = decompressedData[dataIndex++]; // A
					} else {
						pixels[pixelIndex++] = 255; // A (fully opaque by default)
					}
				}
			}
		} catch (error) {
			console.error("Error processing PNG image:", error);
			return null;
		}
	}
	
	if (!width || !height || !pixels) {
		console.error("Unable to process the image");
		return null;
	}
	
	// Create the canvas and render the image
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	
	// Create and fill the ImageData
	const imageData = ctx.createImageData(width, height);
	imageData.data.set(pixels);
	
	// Render on the canvas
	ctx.putImageData(imageData, 0, 0);
	
	return canvas;
}

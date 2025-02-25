// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import { uuid, createCanvas, sanitizeFilename } from "../helpers.js"
import ImageModel from "./image.js"


// @todo: it only works (barley) for pixel art fonts for now.
// It could be improved on future, but for now it's okay.
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

	constructor(gl, fontName, size = 16, isLowscale=true, glyphset=Font.UNICODE) {
		this.gl = gl;
		this.fontName = fontName;
		this.glyphs = new Map();
		this.size = size;
		this.glyphset = glyphset;
		this.isLowscale = isLowscale;
		this.generateAtlas();
	}
	
	generateAtlas() {
		// Aumentar o tamanho do atlas para evitar sobreposições
		const atlasWidth = 1024;
		const atlasHeight = 1024;
		const canvas = createCanvas(atlasWidth, atlasHeight, this.isLowscale);
		const ctx = canvas.getContext("2d");
		
		// Aumentar o padding para evitar vazamentos entre caracteres
		const padding = 4; // Aumento do padding para evitar vazamentos
		const maxHeight = this.size + padding * 2;
		
		// Limpar o canvas com cor transparente para não haver resíduos
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		// Configuração para renderizar nosso conjunto de glifos
		ctx.fillStyle = "white";
		ctx.font = `${this.size}px ${this.fontName}`;
		ctx.textBaseline = "top"; // Consistência no posicionamento vertical
		
		let x = padding;
		let y = padding;
		const lineHeight = this.size + padding * 2;
		
		this.glyphset.split("").forEach(char => {
			const metrics = ctx.measureText(char);
			// Calculamos a largura real do caractere 
			const charWidth = Math.ceil(metrics.width) + padding * 2;
			
			// Se não há espaço suficiente na linha atual, pule para a próxima
			if (x + charWidth > atlasWidth - padding) {
				x = padding;
				y += lineHeight;
			}
			
			// Limpar a área específica para este caractere completamente
			ctx.clearRect(x - padding, y - padding, charWidth + padding, lineHeight + padding);
			
			// Desenhar o caractere centralizado em sua área
			ctx.fillText(char, x, y);
			
			// Salvar métricas para uso posterior
			this.glyphs.set(char, {
				width: metrics.width,
				height: this.size,
				advanceX: metrics.width + padding,
				// Coordenadas UV com margens seguras para evitar vazamentos
				u1: (x) / atlasWidth,
				v1: y / atlasHeight,
				u2: (x + metrics.width) / atlasWidth,
				v2: (y + this.size) / atlasHeight
			});
			
			// Avançar para o próximo caractere com padding adicional entre eles
			x += charWidth;
		});
		
		// Aplicar tratamento de borda nítida se necessário
		if (this.isLowscale) {
			this.preserveCrispEdges(canvas, 0.4); // Threshold ajustado para melhor detecção de bordas
		}
		
		this.atlas = new ImageModel(this.gl, canvas);
	}
	
	// Melhoria na função de preservação de bordas nítidas
	preserveCrispEdges(canvas, threshold) {
		const ctx = canvas.getContext("2d");
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const data = imageData.data;
		
		// Primeiro passo: Detectar e limpar áreas de baixa opacidade
		for (let i = 0; i < data.length; i += 4) {
			const alpha = data[i + 3] / 255;
			
			if (alpha < threshold) {
				// Limpar completamente pixels de baixa opacidade
				data[i + 0] = 0;
				data[i + 1] = 0;
				data[i + 2] = 0;
				data[i + 3] = 0;
			} else {
				// Maximizar a opacidade para pixels acima do limiar
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
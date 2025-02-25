// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.


export default
class Shader {
	constructor(gl, vsSource, fsSource) {
		this.gl = gl;

		const vs = this.compile(this.gl.VERTEX_SHADER, vsSource);
		const fs = this.compile(this.gl.FRAGMENT_SHADER, fsSource);
		
		if (this.vs !== null && this.fs !== null) {
			this.id = this.gl.createProgram();

			this.gl.attachShader(this.id, vs);
			this.gl.attachShader(this.id, fs);
			this.gl.linkProgram(this.id);

			if (!this.gl.getProgramParameter(this.id, this.gl.LINK_STATUS)) {
				console.error('Error linking program:', this.gl.getProgramInfoLog(this.id));
				this.gl.deleteProgram(this.id);
				this.id = null;
			}

			// Save these shaders are only necessary if
			// you want something like hot reload.
			this.gl.deleteShader(vs);
			this.gl.deleteShader(fs);

			this.uniforms = new Map();
			const numUniforms = this.gl.getProgramParameter(this.id, this.gl.ACTIVE_UNIFORMS);
			for (let i = 0; i < numUniforms; i++) {
				const info = this.gl.getActiveUniform(this.id, i);
				this.uniforms.set(info.name, this.gl.getUniformLocation(this.id, info.name));
			}

			this.attribs = new Map();
			const numAttribs = this.gl.getProgramParameter(this.id, this.gl.ACTIVE_ATTRIBUTES);
			for (let i = 0; i < numAttribs; i++) {
				const info = this.gl.getActiveAttrib(this.id, i);
				this.attribs.set(info.name, this.gl.getAttribLocation(this.id, info.name));
			}
		}
	}

	getUniform(name) {
		if (!this.uniforms.has(name)) {
			console.error('Uniform not found:', name);
		}

		return this.uniforms.get(name);
	}

	getAttrib(name) {
		if (!this.attribs.has(name)) {
			console.error('Attribute not found:', name);
		}

		return this.attribs.get(name);
	}

	compile(type, source) {
		const shader = this.gl.createShader(type);
		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			console.error('Error compiling shader:', this.gl.getShaderInfoLog(shader));
			this.gl.deleteShader(shader);
			return null;
		}

		return shader;
	}

	static loadFromFile(gl, vsFile, fsFile) {
		const a = fetch(vsFile).then(r => r.text());
		const b = fetch(fsFile).then(r => r.text());

		return Promise.all([a, b]).then(([vsSource, fsSource]) => {
			return new Shader(gl, vsSource, fsSource);
		});
	}  
};
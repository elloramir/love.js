// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

export default
class MathModule {
	static random(min, max) {
        if (!min && !max) return Math.random();
        if (!max) return Math.random() * min;
        return Math.random() * (max - min) + min;
	}
}

export
function orthoMat4(left, right, bottom, top, near, far) {
	const lr = 1 / (left - right);
	const bt = 1 / (bottom - top);
	const nf = 1 / (near - far);

	const m00 = -2 * lr;
	const m11 = -2 * bt;
	const m22 = 2 * nf;
	const m30 = (left + right) * lr;
	const m31 = (top + bottom) * bt;
	const m32 = (far + near) * nf;

	return new Float32Array([
		m00,   0,   0, 0,
		  0, m11,   0, 0,
		  0,   0, m22, 0,
		m30, m31, m32, 1
	]);
}

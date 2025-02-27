// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by an MIT
// license that can be found in the LICENSE file.


export function imageLoader(uint8array) {
	return new Promise((resolve, reject) => {
		const blob = new Blob([uint8array]);
		const url = URL.createObjectURL(blob);
		const image = new Image();

		image.src = url;
		image.onload = () => resolve(image);
		image.onerror = () => reject("The image data is not valid");
	});
}


export function soundLoader(uint8array) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([uint8array]);
    const url = URL.createObjectURL(blob);
    const audio = new Audio();
    audio.src = url;
    
    audio.oncanplaythrough = () => {
      resolve(audio);
    };
    
    audio.onerror = () => {
      reject("The sound data is not valid");
    };
  });
}
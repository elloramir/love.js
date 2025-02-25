// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import Project from "./project.js";

Project.loadFromFile("basic.love").then(project => {
	document.body.appendChild(project.canvas);
	project.mainLoop();
});
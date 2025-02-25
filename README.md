### What is that?
The idea of this project is to create a valid Love2D runtime for web applications. You can still have web apps from Love2D using WASM, but as we know, this is not that simple, and the web integration is not 100% perfect. The idea here is to make something compatible and build towards the goal of being displayed on sites like Itch.io.

### Performance and limitations
It uses Wasmoon, which is fast but not as fast as the original JIT runtime. This leads to the first limitation: no JIT library is allowed here since it is the original Lua VM, not the LuaJIT one. So be careful about it in your project...

### Goals
This library is still in early development and does not have any relevant graphics features for now, but we have some goals:

- [ ] All modules and functions implemented even if not supported yet (maybe a Python script)
- [ ] Cover most of the relevant functions from love.graphics
- [ ] Support audio
- [ ] Optional integration with Box2D (we need to reproduce the same API)

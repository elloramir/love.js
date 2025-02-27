// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT license.

import Font from "../models/font.js";
import ImageModel from "../models/image.js";
import Quad from "../models/quad.js";
import { LuaMultiReturn } from "wasmoon";

export default class Graphics {
    constructor(project) {
        this.project = project;
        this.width = project.canvas.width;
        this.height = project.canvas.height;
        this.batcher = project.batcher;
        this.currentFont = project.defaultFont;   
    }

    /**
     * Applies the given Transform object to the current coordinate transformation.
     * 
     * This effectively multiplies the existing coordinate transformation's matrix with the Transform object's internal matrix to produce the new coordinate transformation.
     */
    applyTransform(transform) {
        // Implementação aqui
    }

    /**
     * Draws a filled or unfilled arc at position (x, y). The arc is drawn from angle1 to angle2 in radians. The segments parameter determines how many segments are used to draw the arc. The more segments, the smoother the edge.
     */
    arc(drawmode, x, y, radius, angle1, angle2, segments) {
        // Implementação aqui
    }

    /**
     * Creates a screenshot once the current frame is done (after love.draw has finished).
     * 
     * Since this function enqueues a screenshot capture rather than executing it immediately, it can be called from an input callback or love.update and it will still capture all of what's drawn to the screen in that frame.
     */
    captureScreenshot(filename) {
        // Implementação aqui
    }

    /**
     * Draws a circle.
     */
    circle(mode, x, y, radius) {
        // Implementação aqui
        this.batcher.fillRect(x-radius, y-radius, radius*2, radius*2);
    }

    /**
     * Clears the screen or active Canvas to the specified color.
     * 
     * This function is called automatically before love.draw in the default love.run function. See the example in love.run for a typical use of this function.
     * 
     * Note that the scissor area bounds the cleared region.
     * 
     * In versions prior to 11.0, color component values were within the range of 0 to 255 instead of 0 to 1.
     * 
     * In versions prior to background color instead.
     */
    clear(r, g, b, a, clearstencil, cleardepth) {
        // Implementação aqui
    }

    /**
     * Discards (trashes) the contents of the screen or active Canvas. This is a performance optimization function with niche use cases.
     * 
     * If the active Canvas has just been changed and the 'replace' BlendMode is about to be used to draw something which covers the entire screen, calling love.graphics.discard rather than calling love.graphics.clear or doing nothing may improve performance on mobile devices.
     * 
     * On some desktop systems this function may do nothing.
     */
    discard(discardcolor, discardstencil) {
        // Implementação aqui
    }

    /**
     * Draws a Drawable object (an Image, Canvas, SpriteBatch, ParticleSystem, Mesh, Text object, or Video) on the screen with optional rotation, scaling and shearing.
     * 
     * Objects are drawn relative to their local coordinate system. The origin is by default located at the top left corner of Image and Canvas. All scaling, shearing, and rotation arguments transform the object relative to that point. Also, the position of the origin can be specified on the screen coordinate system.
     * 
     * It's possible to rotate an object about its center by offsetting the origin to the center. Angles must be given in radians for rotation. One can also use a negative scaling factor to flip about its centerline.
     * 
     * Note that the offsets are applied before rotation, scaling, or shearing; scaling and shearing are applied before rotation.
     * 
     * The right and bottom edges of the object are shifted at an angle defined by the shearing factors.
     * 
     * When using the default shader anything drawn with this function will be tinted according to the currently selected color.  Set it to pure white to preserve the object's original colors.
     */
    draw(drawable, x, y, r, sx, sy, ox, oy, kx, ky) {
        this.batcher.drawTex(drawable, x, y, 0, 1, 1, 0, 0);
    }

    /**
     * Draws many instances of a Mesh with a single draw call, using hardware geometry instancing.
     * 
     * Each instance can have unique properties (positions, colors, etc.) but will not by default unless a custom per-instance vertex attributes or the love_InstanceID GLSL 3 vertex shader variable is used, otherwise they will all render at the same position on top of each other.
     * 
     * Instancing is not supported by some older GPUs that are only capable of using OpenGL ES 2 or OpenGL 2. Use love.graphics.getSupported to check.
     */
    drawInstanced(mesh, instancecount, x, y, r, sx, sy, ox, oy, kx, ky) {
        // Implementação aqui
    }

    /**
     * Draws a layer of an Array Texture.
     */
    drawLayer(texture, layerindex, x, y, r, sx, sy, ox, oy, kx, ky) {
        // Implementação aqui
    }

    /**
     * Draws an ellipse.
     */
    ellipse(mode, x, y, radiusx, radiusy) {
        // Implementação aqui
    }

    /**
     * Immediately renders any pending automatically batched draws.
     * 
     * L├ûVE will call this function internally as needed when most state is changed, so it is not necessary to manually call it.
     * 
     * The current batch will be automatically flushed by love.graphics state changes (except for the transform stack and the current color), as well as Shader:send and methods on Textures which change their state. Using a different Image in consecutive love.graphics.draw calls will also flush the current batch.
     * 
     * SpriteBatches, ParticleSystems, Meshes, and Text objects do their own batching and do not affect automatic batching of other draws, aside from flushing the current batch when they're drawn.
     */
    flushBatch() {
        // Implementação aqui
    }

    /**
     * Gets the current background color.
     * 
     * In versions prior to 11.0, color component values were within the range of 0 to 255 instead of 0 to 1.
     */
    getBackgroundColor() {
        // Implementação aqui
    }

    /**
     * Gets the blending mode.
     */
    getBlendMode() {
        // Implementação aqui
    }

    /**
     * Gets the current target Canvas.
     */
    getCanvas() {
        // Implementação aqui
    }

    /**
     * Gets the available Canvas formats, and whether each is supported.
     */
    getCanvasFormats(readable) {
        // Implementação aqui
    }

    /**
     * Gets the current color.
     * 
     * In versions prior to 11.0, color component values were within the range of 0 to 255 instead of 0 to 1.
     */
    getColor() {
        // Implementação aqui
    }

    /**
     * Gets the active color components used when drawing. Normally all 4 components are active unless love.graphics.setColorMask has been used.
     * 
     * The color mask determines whether individual components of the colors of drawn objects will affect the color of the screen. They affect love.graphics.clear and Canvas:clear as well.
     */
    getColorMask() {
        // Implementação aqui
    }

    /**
     * Gets the DPI scale factor of the window.
     * 
     * The DPI scale factor represents relative pixel density. The pixel density inside the window might be greater (or smaller) than the 'size' of the window. For example on a retina screen in Mac OS X with the highdpi window flag enabled, the window may take up the same physical size as an 800x600 window, but the area inside the window uses 1600x1200 pixels. love.graphics.getDPIScale() would return 2 in that case.
     * 
     * The love.window.fromPixels and love.window.toPixels functions can also be used to convert between units.
     * 
     * The highdpi window flag must be enabled to use the full pixel density of a Retina screen on Mac OS X and iOS. The flag currently does nothing on Windows and Linux, and on Android it is effectively always enabled.
     */
    getDPIScale() {
        // Implementação aqui
    }

    /**
     * Returns the default scaling filters used with Images, Canvases, and Fonts.
     */
    getDefaultFilter() {
        return "nearest";
    }

    /**
     * Gets the current depth test mode and whether writing to the depth buffer is enabled.
     * 
     * This is low-level functionality designed for use with custom vertex shaders and Meshes with custom vertex attributes. No higher level APIs are provided to set the depth of 2D graphics such as shapes, lines, and Images.
     */
    getDepthMode() {
        // Implementação aqui
    }

    /**
     * Gets the width and height in pixels of the window.
     */
    getDimensions() {
        return new LuaMultiReturn(this.width, this.height);
    }

    /**
     * Gets the current Font object.
     */
    getFont() {
        // Implementação aqui
    }

    /**
     * Gets whether triangles with clockwise- or counterclockwise-ordered vertices are considered front-facing.
     * 
     * This is designed for use in combination with Mesh face culling. Other love.graphics shapes, lines, and sprites are not guaranteed to have a specific winding order to their internal vertices.
     */
    getFrontFaceWinding() {
        // Implementação aqui
    }

    /**
     * Gets the height in pixels of the window.
     */
    getHeight() {
        return this.height;
    }

    /**
     * Gets the raw and compressed pixel formats usable for Images, and whether each is supported.
     */
    getImageFormats() {
        // Implementação aqui
    }

    /**
     * Gets the line join style.
     */
    getLineJoin() {
        // Implementação aqui
    }

    /**
     * Gets the line style.
     */
    getLineStyle() {
        // Implementação aqui
    }

    /**
     * Gets the current line width.
     */
    getLineWidth() {
        // Implementação aqui
    }

    /**
     * Gets whether back-facing triangles in a Mesh are culled.
     * 
     * Mesh face culling is designed for use with low level custom hardware-accelerated 3D rendering via custom vertex attributes on Meshes, custom vertex shaders, and depth testing with a depth buffer.
     */
    getMeshCullMode() {
        // Implementação aqui
    }

    /**
     * Gets the width and height in pixels of the window.
     * 
     * love.graphics.getDimensions gets the dimensions of the window in units scaled by the screen's DPI scale factor, rather than pixels. Use getDimensions for calculations related to drawing to the screen and using the graphics coordinate system (calculating the center of the screen, for example), and getPixelDimensions only when dealing specifically with underlying pixels (pixel-related calculations in a pixel Shader, for example).
     */
    getPixelDimensions() {
        // Implementação aqui
    }

    /**
     * Gets the height in pixels of the window.
     * 
     * The graphics coordinate system and DPI scale factor, rather than raw pixels. Use getHeight for calculations related to drawing to the screen and using the coordinate system (calculating the center of the screen, for example), and getPixelHeight only when dealing specifically with underlying pixels (pixel-related calculations in a pixel Shader, for example).
     */
    getPixelHeight() {
        // Implementação aqui
    }

    /**
     * Gets the width in pixels of the window.
     * 
     * The graphics coordinate system and DPI scale factor, rather than raw pixels. Use getWidth for calculations related to drawing to the screen and using the coordinate system (calculating the center of the screen, for example), and getPixelWidth only when dealing specifically with underlying pixels (pixel-related calculations in a pixel Shader, for example).
     */
    getPixelWidth() {
        // Implementação aqui
    }

    /**
     * Gets the point size.
     */
    getPointSize() {
        // Implementação aqui
    }

    /**
     * Gets information about the system's video card and drivers.
     */
    getRendererInfo() {
        // Implementação aqui
    }

    /**
     * Gets the current scissor box.
     */
    getScissor() {
        // Implementação aqui
    }

    /**
     * Gets the current Shader. Returns nil if none is set.
     */
    getShader() {
        // Implementação aqui
    }

    /**
     * Gets the current depth of the transform / state stack (the number of pushes without corresponding pops).
     */
    getStackDepth() {
        // Implementação aqui
    }

    /**
     * Gets performance-related rendering statistics.
     */
    getStats(stats) {
        // Implementação aqui
    }

    /**
     * Gets the current stencil test configuration.
     * 
     * When stencil testing is enabled, the geometry of everything that is drawn afterward will be clipped / stencilled out based on a comparison between the arguments of this function and the stencil value of each pixel that the geometry touches. The stencil values of pixels are affected via love.graphics.stencil.
     * 
     * Each Canvas has its own per-pixel stencil values.
     */
    getStencilTest() {
        // Implementação aqui
    }

    /**
     * Gets the optional graphics features and whether they're supported on the system.
     * 
     * Some older or low-end systems don't always support all graphics features.
     */
    getSupported() {
        // Implementação aqui
    }

    /**
     * Gets the system-dependent maximum values for love.graphics features.
     */
    getSystemLimits() {
        // Implementação aqui
    }

    /**
     * Gets the available texture types, and whether each is supported.
     */
    getTextureTypes() {
        // Implementação aqui
    }

    /**
     * Gets the width in pixels of the window.
     */
    getWidth() {
        return this.width;
    }

    /**
     * Sets the scissor to the rectangle created by the intersection of the specified rectangle with the existing scissor.  If no scissor is active yet, it behaves like love.graphics.setScissor.
     * 
     * The scissor limits the drawing area to a specified rectangle. This affects all graphics calls, including love.graphics.clear.
     * 
     * The dimensions of the scissor is unaffected by graphical transformations (translate, scale, ...).
     */
    intersectScissor(x, y, width, height) {
        // Implementação aqui
    }

    /**
     * Converts the given 2D position from screen-space into global coordinates.
     * 
     * This effectively applies the reverse of the current graphics transformations to the given position. A similar Transform:inverseTransformPoint method exists for Transform objects.
     */
    inverseTransformPoint(screenX, screenY) {
        // Implementação aqui
    }

    /**
     * Gets whether the graphics module is able to be used. If it is not active, love.graphics function and method calls will not work correctly and may cause the program to crash.
     * The graphics module is inactive if a window is not open, or if the app is in the background on iOS. Typically the app's execution will be automatically paused by the system, in the latter case.
     */
    isActive() {
        // Implementação aqui
    }

    /**
     * Gets whether gamma-correct rendering is supported and enabled. It can be enabled by setting t.gammacorrect = true in love.conf.
     * 
     * Not all devices support gamma-correct rendering, in which case it will be automatically disabled and this function will return false. It is supported on desktop systems which have graphics cards that are capable of using OpenGL 3 / DirectX 10, and iOS devices that can use OpenGL ES 3.
     */
    isGammaCorrect() {
        // Implementação aqui
    }

    /**
     * Gets whether wireframe mode is used when drawing.
     */
    isWireframe() {
        // Implementação aqui
    }

    /**
     * Draws lines between points.
     */
    line(...points) {
        // Implementação aqui
    }

    /**
     * Creates a new array Image.
     * 
     * An array image / array texture is a single object which contains multiple 'layers' or 'slices' of 2D sub-images. It can be thought of similarly to a texture atlas or sprite sheet, but it doesn't suffer from the same tile / quad bleeding artifacts that texture atlases do ÔÇô although every sub-image must have the same dimensions.
     * 
     * A specific layer of an array image can be drawn with love.graphics.drawLayer / SpriteBatch:addLayer, or with the Quad variant of love.graphics.draw and Quad:setLayer, or via a custom Shader.
     * 
     * To use an array image in a Shader, it must be declared as a ArrayImage or sampler2DArray type (instead of Image or sampler2D). The Texel(ArrayImage image, vec3 texturecoord) shader function must be used to get pixel colors from a slice of the array image. The vec3 argument contains the texture coordinate in the first two components, and the 0-based slice index in the third component.
     */
    newArrayImage(slices, settings) {
        // Implementação aqui
    }

    /**
     * Creates a new Canvas object for offscreen rendering.
     */
    newCanvas(width, height) {
        // Implementação aqui
    }

    /**
     * Creates a new cubemap Image.
     * 
     * Cubemap images have 6 faces (sides) which represent a cube. They can't be rendered directly, they can only be used in Shader code (and sent to the shader via Shader:send).
     * 
     * To use a cubemap image in a Shader, it must be declared as a CubeImage or samplerCube type (instead of Image or sampler2D). The Texel(CubeImage image, vec3 direction) shader function must be used to get pixel colors from the cubemap. The vec3 argument is a normalized direction from the center of the cube, rather than explicit texture coordinates.
     * 
     * Each face in a cubemap image must have square dimensions.
     * 
     * For variants of this function which accept a single image containing multiple cubemap faces, they must be laid out in one of the following forms in the image:
     * 
     * +y
     * 
     * +z +x -z
     * 
     * -y
     * 
     * -x
     * 
     * or:
     * 
     * +y
     * 
     * -x +z +x -z
     * 
     * -y
     * 
     * or:
     * 
     * +x
     * 
     * -x
     * 
     * +y
     * 
     * -y
     * 
     * +z
     * 
     * -z
     * 
     * or:
     * 
     * +x -x +y -y +z -z
     */
    newCubeImage(filename, settings) {
        // Implementação aqui
    }

    /**
     * Creates a new Font from a TrueType Font or BMFont file. Created fonts are not cached, in that calling this function with the same arguments will always create a new Font object.
     * 
     * All variants which accept a filename can also accept a Data object instead.
     */
    newFont(filename) {
        // Implementação aqui
    }

    /**
     * Creates a new Image from a filepath, FileData, an ImageData, or a CompressedImageData, and optionally generates or specifies mipmaps for the image.
     */
    newImage(filename, settings) {
        const data = this.project.getFile(filename);
        if (!data)
            throw "No data found for the image: " + filename;

        const model = new ImageModel(this.project.gl, data);
        
        return model;
    }

    /**
     * Creates a new specifically formatted image.
     * 
     * In versions prior to 0.9.0, L├ûVE expects ISO 8859-1 encoding for the glyphs string.
     */
    newImageFont(filename, glyphs) {
        // Implementação aqui
    }

    /**
     * Creates a new Mesh.
     * 
     * Use Mesh:setTexture if the Mesh should be textured with an Image or Canvas when it's drawn.
     * 
     * In versions prior to 11.0, color and byte component values were within the range of 0 to 255 instead of 0 to 1.
     */
    newMesh(vertices, mode, usage) {
        // Implementação aqui
    }

    /**
     * Creates a new ParticleSystem.
     */
    newParticleSystem(image, buffer) {
        // Implementação aqui
    }

    /**
     * Creates a new Quad.
     * 
     * The purpose of a Quad is to use a fraction of an image to draw objects, as opposed to drawing entire image. It is most useful for sprite sheets and atlases: in a sprite atlas, multiple sprites reside in same image, quad is used to draw a specific sprite from that image; in animated sprites with all frames residing in the same image, quad is used to draw specific frame from the animation.
     */
    newQuad(x, y, width, height, sw, sh) {
        // Implementação aqui
    }

    /**
     * Creates a new Shader object for hardware-accelerated vertex and pixel effects. A Shader contains either vertex shader code, pixel shader code, or both.
     * 
     * Shaders are small programs which are run on the graphics card when drawing. Vertex shaders are run once for each vertex (for example, an image has 4 vertices - one at each corner. A Mesh might have many more.) Pixel shaders are run once for each pixel on the screen which the drawn object touches. Pixel shader code is executed after all the object's vertices have been processed by the vertex shader.
     */
    newShader(code) {
        // Implementação aqui
    }

    /**
     * Creates a new SpriteBatch object.
     */
    newSpriteBatch(image, maxsprites) {
        // Implementação aqui
    }

    /**
     * Creates a new drawable Text object.
     */
    newText(font, textstring) {
        // Implementação aqui
    }

    /**
     * Creates a new drawable Video. Currently only Ogg Theora video files are supported.
     */
    newVideo(filename) {
        // Implementação aqui
    }

    /**
     * Creates a new volume (3D) Image.
     * 
     * Volume images are 3D textures with width, height, and depth. They can't be rendered directly, they can only be used in Shader code (and sent to the shader via Shader:send).
     * 
     * To use a volume image in a Shader, it must be declared as a VolumeImage or sampler3D type (instead of Image or sampler2D). The Texel(VolumeImage image, vec3 texcoords) shader function must be used to get pixel colors from the volume image. The vec3 argument is a normalized texture coordinate with the z component representing the depth to sample at (ranging from 1).
     * 
     * Volume images are typically used as lookup tables in shaders for color grading, for example, because sampling using a texture coordinate that is partway in between two pixels can interpolate across all 3 dimensions in the volume image, resulting in a smooth gradient even when a small-sized volume image is used as the lookup table.
     * 
     * Array images are a much better choice than volume images for storing multiple different sprites in a single array image for directly drawing them.
     */
    newVolumeImage(layers, settings) {
        // Implementação aqui
    }

    /**
     * Resets the current coordinate transformation.
     * 
     * This function is always used to reverse any previous calls to love.graphics.rotate, love.graphics.scale, love.graphics.shear or love.graphics.translate. It returns the current transformation state to its defaults.
     */
    origin() {
        // Implementação aqui
    }

    /**
     * Draws one or more points.
     */
    points(...points) {
        // Implementação aqui
    }

    /**
     * Draw a polygon.
     * 
     * Following the mode argument, this function can accept multiple numeric arguments or a single table of numeric arguments. In either case the arguments are interpreted as alternating x and y coordinates of the polygon's vertices.
     */
    polygon(mode, ...points) {
        // Implementação aqui
    }

    /**
     * Pops the current coordinate transformation from the transformation stack.
     * 
     * This function is always used to reverse a previous push operation. It returns the current transformation state to what it was before the last preceding push.
     */
    pop() {
        // Implementação aqui
    }

    /**
     * Displays the results of drawing operations on the screen.
     * 
     * This function is used when writing your own love.run function. It presents all the results of your drawing operations on the screen. See the example in love.run for a typical use of this function.
     */
    present() {
        // Implementação aqui
    }

    /**
     * Draws text on screen. If no Font is set, one will be created and set (once) if needed.
     * 
     * As of LOVE 0.7.1, when using translation and scaling functions while drawing text, this function assumes the scale occurs first.  If you don't script with this in mind, the text won't be in the right position, or possibly even on screen.
     * 
     * love.graphics.print and love.graphics.printf both support UTF-8 encoding. You'll also need a proper Font for special characters.
     * 
     * In versions prior to 11.0, color and byte component values were within the range of 0 to 255 instead of 0 to 1.
     */
    print(text, x, y, r, sx, sy, ox, oy, kx, ky) {
        this.batcher.drawStr(this.currentFont, text, x, y);
    }

    /**
     * Draws formatted text, with word wrap and alignment.
     * 
     * See additional notes in love.graphics.print.
     * 
     * The word wrap limit is applied before any scaling, rotation, and other coordinate transformations. Therefore the amount of text per line stays constant given the same wrap limit, even if the scale arguments change.
     * 
     * In version 0.9.2 and earlier, wrapping was implemented by breaking up words by spaces and putting them back together to make sure things fit nicely within the limit provided. However, due to the way this is done, extra spaces between words would end up missing when printed on the screen, and some lines could overflow past the provided wrap limit. In version 0.10.0 and newer this is no longer the case.
     * 
     * In versions prior to 11.0, color and byte component values were within the range of 0 to 255 instead of 0 to 1.
     */
    printf(text, x, y, limit, align, r, sx, sy, ox, oy, kx, ky) {
        // Implementação aqui
    }

    /**
     * Copies and pushes the current coordinate transformation to the transformation stack.
     * 
     * This function is always used to prepare for a corresponding pop operation later. It stores the current coordinate transformation state into the transformation stack and keeps it active. Later changes to the transformation can be undone by using the pop operation, which returns the coordinate transform to the state it was in before calling push.
     */
    push(stack) {
        // Implementação aqui
    }

    /**
     * Draws a rectangle.
     */
    rectangle(mode, x, y, width, height) {
        this.batcher.fillRect(x, y, width, height);
    }

    /**
     * Replaces the current coordinate transformation with the given Transform object.
     */
    replaceTransform(transform) {
        // Implementação aqui
    }

    /**
     * Resets the current graphics settings.
     * 
     * Calling reset makes the current drawing color white, the current background color black, disables any active color component masks, disables wireframe mode and resets the current graphics transformation to the origin. It also sets both the point and line drawing modes to smooth and their sizes to 1.0.
     */
    reset() {
        // Implementação aqui
    }

    /**
     * Rotates the coordinate system in two dimensions.
     * 
     * Calling this function affects all future drawing operations by rotating the coordinate system around the origin by the given amount of radians. This change lasts until love.draw() exits.
     */
    rotate(angle) {
        // Implementação aqui
    }

    /**
     * Scales the coordinate system in two dimensions.
     * 
     * By default the coordinate system in L├ûVE corresponds to the display pixels in horizontal and vertical directions one-to-one, and the x-axis increases towards the right while the y-axis increases downwards. Scaling the coordinate system changes this relation.
     * 
     * After scaling by sx and sy, all coordinates are treated as if they were multiplied by sx and sy. Every result of a drawing operation is also correspondingly scaled, so scaling by (2, 2) for example would mean making everything twice as large in both x- and y-directions. Scaling by a negative value flips the coordinate system in the corresponding direction, which also means everything will be drawn flipped or upside down, or both. Scaling by zero is not a useful operation.
     * 
     * Scale and translate are not commutative operations, therefore, calling them in different orders will change the outcome.
     * 
     * Scaling lasts until love.draw() exits.
     */
    scale(sx, sy) {
        // Implementação aqui
    }

    /**
     * Sets the background color.
     */
    setBackgroundColor(red, green, blue, alpha) {
        // Implementação aqui
    }

    /**
     * Sets the blending mode.
     */
    setBlendMode(mode) {
        // Implementação aqui
    }

    /**
     * Captures drawing operations to a Canvas.
     */
    setCanvas(canvas, mipmap) {
        // Implementação aqui
    }

    /**
     * Sets the color used for drawing.
     * 
     * In versions prior to 11.0, color component values were within the range of 0 to 255 instead of 0 to 1.
     */
    setColor(red, green, blue, alpha = 1) {
        this.batcher.setColor(red, green, blue, alpha);
    }

    /**
     * Sets the color mask. Enables or disables specific color components when rendering and clearing the screen. For example, if '''red''' is set to '''false''', no further changes will be made to the red component of any pixels.
     */
    setColorMask(red, green, blue, alpha) {
        // Implementação aqui
    }

    /**
     * Sets the default scaling filters used with Images, Canvases, and Fonts.
     */
    setDefaultFilter(min, mag, anisotropy) {
        // Implementação aqui
    }

    /**
     * Configures depth testing and writing to the depth buffer.
     * 
     * This is low-level functionality designed for use with custom vertex shaders and Meshes with custom vertex attributes. No higher level APIs are provided to set the depth of 2D graphics such as shapes, lines, and Images.
     */
    setDepthMode(comparemode, write) {
        // Implementação aqui
    }

    /**
     * Set an already-loaded Font as the current font or create and load a new one from the file and size.
     * 
     * It's recommended that Font objects are created with love.graphics.newFont in the loading stage and then passed to this function in the drawing stage.
     */
    setFont(font) {
        // Implementação aqui
    }

    /**
     * Sets whether triangles with clockwise- or counterclockwise-ordered vertices are considered front-facing.
     * 
     * This is designed for use in combination with Mesh face culling. Other love.graphics shapes, lines, and sprites are not guaranteed to have a specific winding order to their internal vertices.
     */
    setFrontFaceWinding(winding) {
        // Implementação aqui
    }

    /**
     * Sets the line join style. See LineJoin for the possible options.
     */
    setLineJoin(join) {
        // Implementação aqui
    }

    /**
     * Sets the line style.
     */
    setLineStyle(style) {
        // Implementação aqui
    }

    /**
     * Sets the line width.
     */
    setLineWidth(width) {
        // Implementação aqui
    }

    /**
     * Sets whether back-facing triangles in a Mesh are culled.
     * 
     * This is designed for use with low level custom hardware-accelerated 3D rendering via custom vertex attributes on Meshes, custom vertex shaders, and depth testing with a depth buffer.
     * 
     * By default, both front- and back-facing triangles in Meshes are rendered.
     */
    setMeshCullMode(mode) {
        // Implementação aqui
    }

    /**
     * Creates and sets a new Font.
     */
    setNewFont(size) {
        // Implementação aqui
    }

    /**
     * Sets the point size.
     */
    setPointSize(size) {
        // Implementação aqui
    }

    /**
     * Sets or disables scissor.
     * 
     * The scissor limits the drawing area to a specified rectangle. This affects all graphics calls, including love.graphics.clear.
     * 
     * The dimensions of the scissor is unaffected by graphical transformations (translate, scale, ...).
     */
    setScissor(x, y, width, height) {
        // Implementação aqui
    }

    /**
     * Sets or resets a Shader as the current pixel effect or vertex shaders. All drawing operations until the next ''love.graphics.setShader'' will be drawn using the Shader object specified.
     */
    setShader(shader) {
        // Implementação aqui
    }

    /**
     * Configures or disables stencil testing.
     * 
     * When stencil testing is enabled, the geometry of everything that is drawn afterward will be clipped / stencilled out based on a comparison between the arguments of this function and the stencil value of each pixel that the geometry touches. The stencil values of pixels are affected via love.graphics.stencil.
     */
    setStencilTest(comparemode, comparevalue) {
        // Implementação aqui
    }

    /**
     * Sets whether wireframe lines will be used when drawing.
     */
    setWireframe(enable) {
        // Implementação aqui
    }

    /**
     * Shears the coordinate system.
     */
    shear(kx, ky) {
        // Implementação aqui
    }

    /**
     * Draws geometry as a stencil.
     * 
     * The geometry drawn by the supplied function sets invisible stencil values of pixels, instead of setting pixel colors. The stencil buffer (which contains those stencil values) can act like a mask / stencil - love.graphics.setStencilTest can be used afterward to determine how further rendering is affected by the stencil values in each pixel.
     * 
     * Stencil values are integers within the range of 255.
     */
    stencil(stencilfunction, action, value, keepvalues) {
        // Implementação aqui
    }

    /**
     * Converts the given 2D position from global coordinates into screen-space.
     * 
     * This effectively applies the current graphics transformations to the given position. A similar Transform:transformPoint method exists for Transform objects.
     */
    transformPoint(globalX, globalY) {
        // Implementação aqui
    }

    /**
     * Translates the coordinate system in two dimensions.
     * 
     * When this function is called with two numbers, dx, and dy, all the following drawing operations take effect as if their x and y coordinates were x+dx and y+dy.
     * 
     * Scale and translate are not commutative operations, therefore, calling them in different orders will change the outcome.
     * 
     * This change lasts until love.draw() exits or else a love.graphics.pop reverts to a previous love.graphics.push.
     * 
     * Translating using whole numbers will prevent tearing/blurring of images and fonts draw after translating.
     */
    translate(dx, dy) {
        // Implementação aqui
    }

    /**
     * Validates shader code. Check if specified shader code does not contain any errors.
     */
    validateShader(gles, code) {
        // Implementação aqui
    }

}
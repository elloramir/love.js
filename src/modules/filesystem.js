// Copyright 2025 Elloramir. All rights reserved.
// Use of this source code is governed by a MIT license.


export default class Filesystem {
    constructor(project) {
        this.project = project;
    }

    /**
     * Append data to an existing file.
     */
    append(name, data, size) {
        // Implementação aqui
    }

    /**
     * Gets whether love.filesystem follows symbolic links.
     */
    areSymlinksEnabled() {
        // Implementação aqui
    }

    /**
     * Recursively creates a directory.
     * 
     * When called with 'a/b' it creates both 'a' and 'a/b', if they don't exist already.
     */
    createDirectory(name) {
        // Implementação aqui
    }

    /**
     * Returns the application data directory (could be the same as getUserDirectory)
     */
    getAppdataDirectory() {
        // Implementação aqui
    }

    /**
     * Gets the filesystem paths that will be searched for c libraries when require is called.
     * 
     * The paths string returned by this function is a sequence of path templates separated by semicolons. The argument passed to ''require'' will be inserted in place of any question mark ('?') character in each template (after the dot characters in the argument passed to ''require'' are replaced by directory separators.) Additionally, any occurrence of a double question mark ('??') will be replaced by the name passed to require and the default library extension for the platform.
     * 
     * The paths are relative to the game's source and save directories, as well as any paths mounted with love.filesystem.mount.
     */
    getCRequirePath() {
        // Implementação aqui
    }

    /**
     * Returns a table with the names of files and subdirectories in the specified path. The table is not sorted in any way; the order is undefined.
     * 
     * If the path passed to the function exists in the game and the save directory, it will list the files and directories from both places.
     */
    getDirectoryItems(dir) {
        // Implementação aqui
    }

    /**
     * Gets the write directory name for your game.
     * 
     * Note that this only returns the name of the folder to store your files in, not the full path.
     */
    getIdentity() {
        // Implementação aqui
    }

    /**
     * Gets information about the specified file or directory.
     */
    getInfo(path, filtertype) {
        // Implementação aqui
    }

    /**
     * Gets the platform-specific absolute path of the directory containing a filepath.
     * 
     * This can be used to determine whether a file is inside the save directory or the game's source .love.
     */
    getRealDirectory(filepath) {
        // Implementação aqui
    }

    /**
     * Gets the filesystem paths that will be searched when require is called.
     * 
     * The paths string returned by this function is a sequence of path templates separated by semicolons. The argument passed to ''require'' will be inserted in place of any question mark ('?') character in each template (after the dot characters in the argument passed to ''require'' are replaced by directory separators.)
     * 
     * The paths are relative to the game's source and save directories, as well as any paths mounted with love.filesystem.mount.
     */
    getRequirePath() {
        // Implementação aqui
    }

    /**
     * Gets the full path to the designated save directory.
     * 
     * This can be useful if you want to use the standard io library (or something else) to
     * 
     * read or write in the save directory.
     */
    getSaveDirectory() {
        // Implementação aqui
    }

    /**
     * Returns the full path to the the .love file or directory. If the game is fused to the L├ûVE executable, then the executable is returned.
     */
    getSource() {
        // Implementação aqui
    }

    /**
     * Returns the full path to the directory containing the .love file. If the game is fused to the L├ûVE executable, then the directory containing the executable is returned.
     * 
     * If love.filesystem.isFused is true, the path returned by this function can be passed to love.filesystem.mount, which will make the directory containing the main game (e.g. C:\Program Files\coolgame\) readable by love.filesystem.
     */
    getSourceBaseDirectory() {
        // Implementação aqui
    }

    /**
     * Returns the path of the user's directory
     */
    getUserDirectory() {
        // Implementação aqui
    }

    /**
     * Gets the current working directory.
     */
    getWorkingDirectory() {
        // Implementação aqui
    }

    /**
     * Initializes love.filesystem, will be called internally, so should not be used explicitly.
     */
    init(appname) {
        // Implementação aqui
    }

    /**
     * Gets whether the game is in fused mode or not.
     * 
     * If a game is in fused mode, its save directory will be directly in the Appdata directory instead of Appdata/LOVE/. The game will also be able to load C Lua dynamic libraries which are located in the save directory.
     * 
     * A game is in fused mode if the source .love has been fused to the executable (see Game Distribution), or if '--fused' has been given as a command-line argument when starting the game.
     */
    isFused() {
        // Implementação aqui
    }

    /**
     * Iterate over the lines in a file.
     */
    lines(name) {
        // Implementação aqui
    }

    /**
     * Loads a Lua file (but does not run it).
     */
    load(name) {
        // Implementação aqui
    }

    /**
     * Mounts a zip file or folder in the game's save directory for reading.
     * 
     * It is also possible to mount love.filesystem.getSourceBaseDirectory if the game is in fused mode.
     */
    mount(archive, mountpoint, appendToPath) {
        // Implementação aqui
    }

    /**
     * Creates a new File object.
     * 
     * It needs to be opened before it can be accessed.
     */
    newFile(filename) {
        // Implementação aqui
    }

    /**
     * Creates a new FileData object from a file on disk, or from a string in memory.
     */
    newFileData(contents, name) {
        // Implementação aqui
    }

    /**
     * Read the contents of a file.
     */
    read(name, size) {
        return this.project.getString(filename)?.substr(0, size);
    }

    /**
     * Removes a file or empty directory.
     */
    remove(name) {
        // Implementação aqui
    }

    /**
     * Sets the filesystem paths that will be searched for c libraries when require is called.
     * 
     * The paths string returned by this function is a sequence of path templates separated by semicolons. The argument passed to ''require'' will be inserted in place of any question mark ('?') character in each template (after the dot characters in the argument passed to ''require'' are replaced by directory separators.) Additionally, any occurrence of a double question mark ('??') will be replaced by the name passed to require and the default library extension for the platform.
     * 
     * The paths are relative to the game's source and save directories, as well as any paths mounted with love.filesystem.mount.
     */
    setCRequirePath(paths) {
        // Implementação aqui
    }

    /**
     * Sets the write directory for your game.
     * 
     * Note that you can only set the name of the folder to store your files in, not the location.
     */
    setIdentity(name) {
        // Implementação aqui
    }

    /**
     * Sets the filesystem paths that will be searched when require is called.
     * 
     * The paths string given to this function is a sequence of path templates separated by semicolons. The argument passed to ''require'' will be inserted in place of any question mark ('?') character in each template (after the dot characters in the argument passed to ''require'' are replaced by directory separators.)
     * 
     * The paths are relative to the game's source and save directories, as well as any paths mounted with love.filesystem.mount.
     */
    setRequirePath(paths) {
        // Implementação aqui
    }

    /**
     * Sets the source of the game, where the code is present. This function can only be called once, and is normally automatically done by L├ûVE.
     */
    setSource(path) {
        // Implementação aqui
    }

    /**
     * Sets whether love.filesystem follows symbolic links. It is enabled by default in version 0.10.0 and newer, and disabled by default in 0.9.2.
     */
    setSymlinksEnabled(enable) {
        // Implementação aqui
    }

    /**
     * Unmounts a zip file or folder previously mounted for reading with love.filesystem.mount.
     */
    unmount(archive) {
        // Implementação aqui
    }

    /**
     * Write data to a file in the save directory. If the file existed already, it will be completely replaced by the new contents.
     */
    write(name, data, size) {
        // Implementação aqui
    }

}
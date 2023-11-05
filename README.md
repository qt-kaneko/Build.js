## Really smol build system.

### It can:
1) Include specified files or folders (+ rename them if you want to)
2) Run your TypeScript compiler
3) Restore NPM packages
4) Replace strings in files after build

### How to use
1) Download [latest release](https://github.com/qt-kaneko/Build.js/releases/latest).
2) Place it in your project folder.
3) Prepend content in it with [`CONFIG`](#config).
4) Run script using `node build.js`.
5) You are done!

### CONFIG
`CONFIG` constant is used to configure your build and keep all in single build.js file.
It contains:
- [Resources](#resources) - strings you want to replace in your distribution.
- `"destination": "your folder where distribution is placed"`
- [Includes](#includes) - files you want to include in your distribution.
<details>
<summary> Example CONFIG </summary>

```js
const CONFIG = {
  "resources": {
    "version": "1.0.0"
  },

  "destination": "dist",
  "includes": ["text.txt", "assets/icon.png"]
  // Or
  // "includes": [
  //   ["src/text.txt", "text.txt"],
  //   ["assets/icon-128.png", "icon.png"]
  // ]
  // Or
  // "includes": {
  //   "configuration1": ["text.txt"],
  //   "configuration2": ["icon.png"]
  // }
  // Or
  // "includes": {
  //   "configuration1": [
  //     ["src/text.txt", "text.txt"]
  //   ],
  //   "configuration2": [
  //     ["assets/icon-128.png", "icon.png"]
  //   ]
  // }

  // Also some special flags
  // "npm": false
  // "typescript": false
};

// The rest of build.js
```
</details>

### Resources
You can use resources to replace specified strings in your files:
```json
{
  "resources": {
    "version": "1.0.0"
  }
}
```
Will replace all `$(VERSION)` with `1.0.0` in your distribution files.
As you can see, replacement format is `$(YOUR_RESOURCE_NAME_UPPERCASE)`.

You can also replace `$(THING)` with specified file content. Use `file://` format to specify file as a content source:
```json
{
  "resources": {
    "text": "file://text.txt"
  }
}
```
Will replace all `$(TEXT)` with `text.txt` content.

### Includes
You can include files using
```json
{
  "destination": "dist",
  "includes": ["text.txt", "assets/icon.png"]
}
```
Using this syntax file will be included in destnation folder with path provided to file (like `assets/icon.png` will be `dist/assets/icon.png`).

or

```json
{
  "destination": "dist",
  "includes": [
    ["src/text.txt", "text.txt"],
    ["assets/icon-128.png", "icon.png"]
  ]
}
```
This will include specified files renaming them and placing in folder you specified.

or

```json
{
  "destination": "dist",
  "includes": {
    "configuration1": ["text.txt"],
    "configuration2": ["icon.png"]
  }
}
```
This will include files for selected build configuration.

or
```json
{
  "destination": "dist",
  "includes": {
    "configuration1": [
      ["src/text.txt", "text.txt"]
    ],
    "configuration2": [
      ["assets/icon-128.png", "icon.png"]
    ]
  }
}
```
This will include files for selected build configuration renaming and copying them into directory you specified.

### TypeScript
There are two compiling modes: Release and Debug.
- Debug mode is used by default.
To build in Release mode add --release or -r flag when running script.
- Release mode compiles using tsconfig.release.json (you can use it to overwrite some settings in default tsconfig.json, like disable mappings).

e.g. to run build in Release mode, use `node build.js --release` (or `-r`).

### NPM
NPM is being run with `npm install` if there is `package.json` in the root folder. You can force disable NPM by adding `"npm": false` in `CONFIG`.
## Really smol build system.

### It can:
1) Include specified files or folders (+ rename them if you want to).
2) Run your TypeScript compiler.
3) Run your ESBuild bundler.
4) Restore NPM packages.
5) Replace strings in files after build.

### How to use
1) Download [latest release](https://github.com/qt-kaneko/Build.js/releases/latest).
2) Place it in your project folder.
3) Prepend content in it with [`CONFIG`](#config).
4) Run script using `node build.js`.
5) You are done!

### CONFIG
`CONFIG` constant is used to configure your build and keep everything in the single `build.js` file.

It contains:
- [Resources](#resources) - strings you want to replace in your distribution.
- `"destination": "your folder where distribution is placed"`
- [Includes](#includes) - files you want to include in your distribution.
- [ESBuild](#esbuild) - configuration options for ESBuild bundler.
- [Fancy stuff](#fancy-stuff) - Flags if you want to force change some auto settings.
<details>
<summary> Example CONFIG </summary>

```js
const CONFIG = {
  resources: {
    version: "1.0.0"
  },

  destination: "dist",
  includes: ["text.txt", "assets/icon.png"]
  // Or
  // includes: [
  //   ["src/text.txt", "text.txt"],
  //   ["assets/icon-128.png", "icon.png"]
  // ]
  // Or
  // includes: {
  //   configuration1: ["text.txt"],
  //   configuration2: ["icon.png"]
  // }
  // Or
  // includes: {
  //   configuration1: [
  //     ["src/text.txt", "text.txt"]
  //   ],
  //   configuration2: [
  //     ["assets/icon-128.png", "icon.png"]
  //   ]
  // }

  // Maybe ESBuild?
  // esbuild: {
  //   entry: "src/index.ts",
  //   outFile: "index.js"
  // },

  // Also some special flags
  // npm: false
  // typescript: false
};

// The rest of build.js
```
</details>

### Resources
You can use resources to replace specified strings in your files:
```js
{
  resources: {
    version: "1.0.0"
  }
}
```
Will replace all `$(VERSION)` with `1.0.0` in your distribution files.
As you can see, replacement format is `$(YOUR_RESOURCE_NAME_UPPERCASE)`.

You can also replace `$(THING)` with specified file content. Use `file://` format to specify file as a content source:
```js
{
  resources: {
    text: "file://text.txt"
  }
}
```
Will replace all `$(TEXT)` with `text.txt` content.

> If file is binary then `$(THING)` will be replaced with `base64` encoded content.

### Includes
You can include files using
```js
{
  destination: "dist",
  includes: ["text.txt", "assets/icon.png"]
}
```
Using this syntax file will be included in destnation folder with path provided to file (like `assets/icon.png` will be `dist/assets/icon.png`).

or

```js
{
  destination: "dist",
  includes: [
    ["src/text.txt", "text.txt"],
    ["assets/icon-128.png", "icon.png"]
  ]
}
```
This will include specified files renaming them and placing in folder you specified.

or

```js
{
  destination: "dist",
  includes: {
    configuration1: ["text.txt"],
    configuration2: ["icon.png"]
  }
}
```
This will include files for selected [build configuration](#build-configurations).

or
```js
{
  destination: "dist",
  includes: {
    configuration1: [
      ["src/text.txt", "text.txt"]
    ],
    configuration2: [
      ["assets/icon-128.png", "icon.png"]
    ]
  }
}
```
This will include files for selected [build configuration](#build-configurations) renaming and copying them into directory you specified.

### Build configurations
As mentioned before, configurations are used for includes (and maybe will be used for more in the future 😜).

You can run build using configuration specifying it in args, like:

`node build.js configuration1`

Also to run build using configuration in release use:

`node build.js configuration1 --release`

You can read more about release in [TypeScript](#typescript) section.

### TypeScript
There are two compiling modes: Release and Debug.
- Debug mode is used by default.
To build in Release mode add --release or -r flag when running script.
- Release mode compiles using tsconfig.release.json (you can use it to overwrite some settings in default tsconfig.json, like disable mappings).

e.g. to run build in Release mode, use `node build.js --release` (or `-r`).

### ESBuild
Add `esbuild` to your configuration:
```js
{
  esbuild: {
    entry: "src/index.ts", // Path to your entry point file
    outFile: "index.js" // Path to out file relative to CONFIG.destination
  }
}
```

### NPM
NPM is being run with `npm install` if there is `package.json` in the root folder. You can force disable NPM by adding `npm: false` in `CONFIG`.

See [fancy stuff](#fancy-stuff) to disable this.

### Fancy stuff
- `typescript: false` - force-disable typescript.
- `npm: false` - force-disable npm.

### How to build (this build system 😁)
- Run `tsc`

You need TSC (TypeScript Compiler) to be installed in your environment.
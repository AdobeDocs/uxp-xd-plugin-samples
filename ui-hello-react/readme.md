# React Starter Plugin

This plugin is a good place to get started when building a XD plugin using React. It comes defined with all the dependencies that you'll need to get started. As this is a React project, you'll need to do some initial configuration before this will be usable in XD.

## Install dependencies

First ensure that your terminal is in the root of this project. Then:

For `yarn` users, install all dependencies using:

```
yarn install
```

For `npm` users, install all dependencies using:

```
npm install
```

## Build Process

There are two ways to build the plugin for use in XD:

* `yarn watch` or `npm run watch` will build a development version of the plugin, and recompile everytime you make a change to the source files. The result is placed in `dist`. 
* `yarn build` or `npm run build` will build a production version of the plugin and place it in `dist`. It will not update every time you make a change to the source files.

> You **must** run either `watch` or `build` prior to trying to use within XD!

## Launching in XD

You can use the UXP Developer Tools to load the plugin into XD.

If the plugin hasn't already been added to your workspace in the UXP Developer Tools, you can add it by clicking "Add Plugin..." and selecting `dist/manifest.json`. **DO NOT** select the `manifest.json` file inside the `plugin` folder.

Once added, you can load it into XD by clicking the ••• button on the corresponding row, and clicking "Load". Switch to XD and you should see the plugin loaded into the `Plugins` menu.

## What this plugin does

This plugin illustrates how to create a basic panel and a commmand in XD with `entrypoints.setup`. It also demonstrates the use of several Spectrum UXP widgets to create a simple color picker in the primary panel that uses the UXP `scenegraph` API to change the color of a selected component on the XD canvas.
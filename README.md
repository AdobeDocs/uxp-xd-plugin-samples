# Plugin Samples

This repository contains a library of sample XD plugins to help you on your
journey. You can use these samples to learn more about how to build plugins for
Adobe XD (with UXP 4 and above).

## Samples list

**If you're adding a sample to the repo, feel free to add it to this list.**

| Extension               | Main APIs Used                                             | Description                                                                                  | Minimum Version                 |
| ----------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------- |
| cross-compatible-sample | Spectrum UXP, XD Scenegraph, BatchPlay Cross Compatibility | Demonstrates bundling a plugin that is compatible for both PS and XD development             | UXP 4.1 / XD 36.0.0 / PS 22.0.0 |
| desktop-helper-sample   | Spectrum UXP, React Spectrum, Electron, React, socket.io   | Demonstrates using Electron and socket.io to communicate with a UXP plugin from a helper app | UXP 4.1 / XD 36.0.0             |
| quick-start-panel       | XD Scenegraph                                              | Shows how to create and insert a rectangle into the artboard                                 | UXP 4.1 / XD 36.0.0             |
| secure-storage          | Spectrum UXP, UXP Secure Storage                           | Demonstrates using UXP's secure storage API to store and retrieve local data                 | UXP 4.1 / XD 36.0.0             |
| ui-hello-react          | Spectrum UXP, React                                        | Shows how to use React in a simple plugin                                                    | UXP 4.1 / XD 36.0.0             |
| ui-hello-svelte         | Spectrum UXP, Svelte                                       | Shows how to use Svelte in a simple plugin                                                   | UXP 4.1 / XD 36.0.0             |
| ui-hello-vue            | Spectrum UXP, Vue                                          | Shows how to use Vue in a simple plugin                                                      | UXP 4.1 / XD 36.0.0             |
| wasm-rust-sample        | Spectrum UXP, Rust, WebAssembly                            | Uses wasm-bindgen and Rust to leverage WebAssembly in a UXP plugin                           | UXP 4.1 / XD 36.0.0             |

## Recommended development setup

1. Clone this repository to a location of your choice:

```
git clone git@github.com:AdobeDocs/uxp-xd-plugin-samples.git
```

2. Launch the [UXP Developer Tool](https://www.adobe.io/photoshop/uxp/devtool/)
   and use the "Add Plugin..." button to add each plugin to your workspace
   (select the `manifest.json` file indicated by your plugin's README, typically
   these are in the root, `plugin`, or `dist` folders).

3. Load plugins into Photoshop by using **••• > Load**.

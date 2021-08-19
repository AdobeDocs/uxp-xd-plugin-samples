/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@adobe/xd-plugin-toolkit/lib/dialogs.js":
/*!**************************************************************!*\
  !*** ./node_modules/@adobe/xd-plugin-toolkit/lib/dialogs.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Copyright 2018 Adobe Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const {getManifest, getNearestIcon} = __webpack_require__(/*! ./manifest.js */ "./node_modules/@adobe/xd-plugin-toolkit/lib/manifest.js");

let manifest;

/**
 * Converts a string (or an array of strings or other objects) to a nicer HTML
 * representation. Essentially this is a _very_ basic markdown parser.
 *
 * The following tokens are understood, when encountered at the beginning of
 * a string:
 *
 * Token        | Result
 * -------------|-----------------------
 * `##`         | `<h2>`
 * `###`        | `<h3>`
 * `* `         | Bulleted list
 * `----`       | `<hr class="small">`
 * `---`        | `<hr />`
 * `[...](href)`| `<p><a href="href">...</a></p>`
 *
 * @param {string | string[] | * | Array<*>} str
 * @returns {string} the HTML representation
 */
function strToHtml(str) {
    // allow some common overloads, including arrays and non-strings
    if (Array.isArray(str)) {
        return str.map(str => strToHtml(str)).join('');
    }
    if (typeof str !== 'string') {
        return strToHtml(`${str}`);
    }

    let html = str;

    // handle some markdown stuff
    if (html.substr(0, 2) === '##') {
        html = `<h3>${html.substr(2).trim().toUpperCase()}</h3>`;
    } else if (html.substr(0, 1) === '#') {
        html = `<h2>${html.substr(1).trim()}</h2>`;
    } else if (html.substr(0, 2) === '* ') {
        html = `<p class="list"><span class="bullet margin">•</span><span class="margin">${html.substr(2).trim()}</span></p>`;
    } else if (html.substr(0, 4) === '----') {
        html = `<hr class="small"/>${html.substr(5).trim()}`;
    } else if (html.substr(0, 3) === '---') {
        html = `<hr/>${html.substr(4).trim()}`;
    } else {
        html = `<p>${html.trim()}</p>`;
    }

    // handle links -- the catch here is that the link will transform the entire paragraph!
    const regex = /\[([^\]]*)\]\(([^\)]*)\)/;
    const matches = str.match(regex);
    if (matches) {
        const title = matches[1];
        const url = matches[2];
        html = `<p><a href="${url}">${html.replace(regex, title).replace(/\<\|?p\>/g, '')}</a></p>`;
    }

    return html;
}

/*
 * Generates a "notice" dialog with the title, default icon, and a series of messages.
 *
 * @param {*} param
 * @property {string} param.title The dialog title
 * @property {string} [param.icon] The dialog icon to use. If not provided, no icon will be rendered
 * @property {string[]} param.msgs The messages to render. If a message starts with `http`, it will be rendered as a link.
 * @property {string} [param.prompt] If specified, will render as a prompt with a single input field and the prompt as a placeholder
 * @property {boolean} [param.multiline=false] If `true`, the prompt will render as a multi-line text field.
 * @property {boolean} [param.isError=false] If specified, will render the header in a red color
 * @property {Function} [param.render] If set, the results of this function (a DOM tree) will be appended into the content area of the dialog.
 * @property {Function<String>} [param.template] If set, the results of this function (a string) will be appended into the content area of the dialog.
 * @property {Object[]} [buttons] Indicates the buttons to render. If none are specified, a `Close` button is rendered.
 * @returns {Promise} Resolves to an object of the form {which, value}. `value` only makes sense if `prompt` is set. `which` indicates which button was pressed.
 */
async function createDialog({
    title,
    icon = 'plugin-icon',
    msgs,
    prompt,
    multiline = false,
    render,
    template,
    isError=false,
    buttons=[
        {label: 'Close', variant: 'cta', type:'submit'}
    ]} = {},
    width=360,
    height='auto',
    iconSize=18
) {

    let messages = Array.isArray(msgs) ? msgs : [ msgs ];

    try {
        if (!manifest) {
            manifest = await getManifest();
        }
    } catch (err) {
        // do nothing
    }

    let usingPluginIcon = false;
    if (icon === 'plugin-icon') {
        if (manifest.icons) {
            usingPluginIcon = true;
            iconSize = 24;
            icon = getNearestIcon(manifest, iconSize);
        }
    }

    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
<style>
    form {
        width: ${width}px;
    }
    .h1 {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .h1 img {
        width: ${iconSize}px;
        height: ${iconSize}px;
        flex: 0 0 ${iconSize}px;
        padding: 0;
        margin: 0;
    }
    img.plugin-icon {
        border-radius: 4px;
        overflow: hidden;
    }
    .list {
        display: flex;
        flex-direction: row;
    }
    .list .margin {
        margin-bottom: 0;
        margin-left: 0;
    }
    .list span {
        flex: 0 0 auto;
        border: 1px solid transparent;
    }
    .list .bullet {
        text-align: center;
    }
    .list + .list {
        margin-top: 0;
    }
    textarea {
        height: 200px;
    }
    .container {
        zoverflow-x: hidden;
        overflow-y: auto;
        height: ${height === 'auto' ? height : `${height}px`};
    }
</style>
<form method="dialog">
    <h1 class="h1">
        <span ${isError ? `class="color-red"` : ""}>${title}</span>
        ${icon ? `<img ${usingPluginIcon ? `class="plugin-icon" title="${manifest.name}"` : ''} src="${icon}" />` : ''}
    </h1>
    <hr />
    <div class="container">
        ${
            !render && (
                template ? template() : (
                    messages.map(msg => strToHtml(msg)).join('') +
                    (prompt ? `<label>${
                        multiline ?
                        `<textarea id="prompt" placeholder="${prompt}"></textarea>` :
                        `<input type="text" id="prompt" placeholder="${prompt}" />`
                    }</label>` : '')
                )
            )
        }
    </div>
    <footer>
        ${buttons.map(({label, type, variant} = {}, idx) => `<button id="btn${idx}" type="${type}" uxp-variant="${variant}">${label}</button>`).join('')}
    </footer>
</form>
    `;

    // if render fn is passed, we'll call it and attach the DOM tree
    if (render) {
        dialog.querySelector(".container").appendChild(render());
    }

    // The "ok" and "cancel" button indices. OK buttons are "submit" or "cta" buttons. Cancel buttons are "reset" buttons.
    let okButtonIdx = -1;
    let cancelButtonIdx = -1;
    let clickedButtonIdx = -1;

    // Ensure that the form can submit when the user presses ENTER (we trigger the OK button here)
    const form = dialog.querySelector('form');
    form.onsubmit = () => dialog.close('ok');

    // Attach button event handlers and set ok and cancel indices
    buttons.forEach(({type, variant} = {}, idx) => {
        const button = dialog.querySelector(`#btn${idx}`);
        if (type === 'submit' || variant === 'cta') {
            okButtonIdx = idx;
        }
        if (type === 'reset') {
            cancelButtonIdx = idx;
        }
        button.onclick = e => {
            e.preventDefault();
            clickedButtonIdx = idx;
            dialog.close( idx === cancelButtonIdx ? 'reasonCanceled' : 'ok');
        }
    });

    try {
        document.appendChild(dialog);
        const response = await dialog.showModal();
        if (response === 'reasonCanceled') {
            // user hit ESC
            return {which: cancelButtonIdx, value: ''};
        } else {
            if (clickedButtonIdx === -1) {
                // user pressed ENTER, so no button was clicked!
                clickedButtonIdx = okButtonIdx; // may still be -1, but we tried
            }
            return {which: clickedButtonIdx, value: prompt ? dialog.querySelector('#prompt').value : ''};
        }
    } catch(err) {
        // system refused the dialog
        return {which: cancelButtonIdx, value: ''};
    } finally {
        dialog.remove();
    }
}

/**
 * Generates an alert message
 *
 * @param {string} title
 * @param {string[]} msgs
 * @returns {Promise<{which: number}>} `which` indicates which button was clicked.
 */
async function alert(title, ...msgs) {
    return createDialog({title, msgs});
}

/**
 * Generates a warning message
 *
 * @param {string} title
 * @param {string[]} msgs
 * @returns {Promise<{which: number}>} `which` indicates which button was clicked.
 */
async function error(title, ...msgs) {
    return createDialog({title, isError: true, msgs});
}

/**
 * Displays a confirmation dialog.
 *
 * @param {string} title
 * @param {string} msg
 * @param {string[]} [buttons = ['Cancel', 'OK']] the buttons to display (in macOS order); TWO MAX.
 * @returns {Promise<{which: number}>} `which` indicates which button was clicked.
 */
async function confirm(title, msg, buttons = [ 'Cancel', 'OK' ]) {
    return createDialog({title, msgs: [msg], buttons: [
        {label: buttons[0], type:'reset', variant: 'primary'},
        {label: buttons[1], type:'submit', variant: 'cta'}
    ]});
}

/**
 * Displays a warning dialog.
 *
 * @param {string} title
 * @param {string} msg
 * @param {string[]} [buttons = ['Cancel', 'OK']] the buttons to display (in macOS order); TWO MAX.
 * @returns {Promise<{which: number}>} `which` indicates which button was clicked.
 */
async function warning(title, msg, buttons = [ 'Cancel', 'OK' ]) {
    return createDialog({title, msgs: [msg], buttons: [
        {label: buttons[0], type:'submit', variant: 'primary'},
        {label: buttons[1], type:'button', variant: 'warning'}
    ]});
}

/**
 * Displays a warning dialog.
 *
 * @param {string} title
 * @param {string} msg
 * @param {string} prompt
 * @param {string[]} [buttons = ['Cancel', 'OK']] the buttons to display (in macOS order); TWO MAX.
 * @param {boolean} [multiline = false] If `true`, a multiline textarea will be used instead of a single line editor.
 * @returns {Promise<{which: number, value: string}>} `which` indicates which button was clicked, and `value` indicates the entered value in the text field.
 */
async function prompt(title, msg, prompt, buttons = [ 'Cancel', 'OK' ], multiline = false) {
    return createDialog({title, msgs: [msg], prompt, multiline, buttons: [
        {label: buttons[0], type:'reset', variant: 'primary'},
        {label: buttons[1], type:'submit', variant: 'cta'}
    ]});
}

module.exports = {
    createDialog,
    alert,
    error,
    confirm,
    warning,
    prompt
};

/***/ }),

/***/ "./node_modules/@adobe/xd-plugin-toolkit/lib/manifest.js":
/*!***************************************************************!*\
  !*** ./node_modules/@adobe/xd-plugin-toolkit/lib/manifest.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Copyright 2018 Adobe Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

let manifest;

/**
 * Reads the plugin's manifest and returns the parsed contents.
 *
 * Throws if the manifest is invalid or doesn't exist.
 *
 * Note: Reads manifest only once. Future calls will not reload
 * the manifest file.
 */
async function getManifest() {
    if (!manifest) {
        const fs = __webpack_require__(/*! uxp */ "uxp").storage.localFileSystem;
        const dataFolder = await fs.getPluginFolder();
        const manifestFile = await dataFolder.getEntry("manifest.json");
        if (manifestFile) {
            const json = await manifestFile.read();
            manifest = JSON.parse(json);
        }
    }
    return manifest;
}

/**
 * Return the icon path that can fit the requested size without upscaling.
 *
 * @param {*} manifest
 * @param {number} size
 * @returns {string} path to the icon
 */
function getNearestIcon(manifest, size) {
    if (!manifest) {
        return;
    }

    if (manifest.icons) {
        // icons is an array of objects of the form
        // { width, height, path }

        // icons are assumed to be square, so we'll sort descending on the width
        const sortedIcons = manifest.icons.sort((a, b) => {
            const iconAWidth = a.width;
            const iconBWidth = b.width;
            return iconAWidth < iconBWidth ? 1 : iconAWidth > iconBWidth ? -1 : 0;
        });

        // next, search until we find an icon _too_ small for the desired size
        const icon = sortedIcons.reduce((last, cur) => {
            if (!last) {
                last = cur;
            } else {
                if (cur.width >= size) {
                    last = cur;
                }
            }
            return last;
        });

        return icon.path;
    }
}

module.exports = {
    getManifest,
    getNearestIcon
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/index.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/index.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "html, body {\n  margin: 0;\n  height: 100%;\n  width: 100%;\n  background-color: var(--uxp-host-background-color);\n  color: var(--uxp-host-text-color);\n}\n\n.container {\n  display: flex;\n  flex-direction: column;\n  padding: 12px;\n}\n\n.help {\n  position: absolute;\n  right: 0;\n}\n\n.heading {\n  margin-top: 0;\n}\n\n.field {\n  margin-top: 1em;\n  padding: 0;\n}\n\n.textarea {\n  width: 100%;\n}\n\n.create {\n  width: 50%;\n  margin-top: 2em;\n  align-self: center;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./src/index.css":
/*!***********************!*\
  !*** ./src/index.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./index.css */ "./node_modules/css-loader/dist/cjs.js!./src/index.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__.default, options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__.default && _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__.default.locals ? _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__.default.locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var style = document.createElement("style");
  options.setAttributes(style, options.attributes);
  options.insert(style);
  return style;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(style) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    style.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute("media", media);
  } else {
    style.removeAttribute("media");
  }

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, style);
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


function domAPI(options) {
  var style = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(style, options, obj);
    },
    remove: function remove() {
      removeStyleElement(style);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, style) {
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "application":
/*!******************************!*\
  !*** external "application" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("application");

/***/ }),

/***/ "photoshop":
/*!****************************!*\
  !*** external "photoshop" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("photoshop");

/***/ }),

/***/ "scenegraph":
/*!*****************************!*\
  !*** external "scenegraph" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("scenegraph");

/***/ }),

/***/ "uxp":
/*!**********************!*\
  !*** external "uxp" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("uxp");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.css */ "./src/index.css");
/* harmony import */ var uxp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uxp */ "uxp");
/* harmony import */ var uxp__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(uxp__WEBPACK_IMPORTED_MODULE_1__);


var APP_TYPE = (uxp__WEBPACK_IMPORTED_MODULE_1__.host === null || uxp__WEBPACK_IMPORTED_MODULE_1__.host === void 0 ? void 0 : uxp__WEBPACK_IMPORTED_MODULE_1__.host.name) === "Photoshop" ? "Photoshop" : "XD"; //Currently a bug with host being undefined in XD, fixed in UXP 5.3 (XD 43)

uxp__WEBPACK_IMPORTED_MODULE_1__.entrypoints.setup({
  commands: {
    about: {
      run: function run() {
        showAbout();
      }
    }
  },
  panels: {
    plugin: {
      show: function show() {},
      menuItems: [{
        id: "about",
        label: "About"
      }],
      invokeMenu: function invokeMenu(id) {
        if (id === "about") {
          showAbout();
        }
      }
    }
  }
});
window.addEventListener("load", function () {
  document.getElementById("aboutBtn").onclick = showAbout;
  document.getElementById("create").onclick = createLabel;
  document.getElementById("app").innerHTML = APP_TYPE;
  document.getElementById("textarea").addEventListener("input", function (e) {
    if (e.target.value.length > 0) {
      e.target.invalid = false;
      e.target.valid = true;
    } else {
      e.target.valid = false;
      e.target.invalid = true;
    }
  });
});

function showAbout() {
  var uxpVersion = uxp__WEBPACK_IMPORTED_MODULE_1__.versions.uxp.split("-")[1];

  if (APP_TYPE === "Photoshop") {
    var app = __webpack_require__(/*! photoshop */ "photoshop").app;

    app.showAlert("Cross-Compatible JS Sample\n\nApp: ".concat(uxp__WEBPACK_IMPORTED_MODULE_1__.host.name, "\nVersion: ").concat(uxp__WEBPACK_IMPORTED_MODULE_1__.host.version, "\nUXP: ").concat(uxpVersion));
  } else {
    var application = __webpack_require__(/*! application */ "application");

    var dialog = __webpack_require__(/*! @adobe/xd-plugin-toolkit/lib/dialogs.js */ "./node_modules/@adobe/xd-plugin-toolkit/lib/dialogs.js");

    dialog.alert("Cross-Compatible JS Sample", "App: XD", "Version: ".concat(application.version), "UXP: ".concat(uxpVersion));
  }
}

function createLabel(e) {
  var textArea = document.getElementById("textarea");

  if (textArea.value.length === 0) {
    textArea.invalid = true;
  } else if (APP_TYPE === "Photoshop") {
    var batchPlay = __webpack_require__(/*! photoshop */ "photoshop").action.batchPlay;

    var command = {
      _obj: "make",
      _target: [{
        _ref: "textLayer"
      }],
      using: {
        _obj: "textLayer",
        textKey: textArea.value,
        textShape: [{
          _obj: "textShape",
          "char": {
            _enum: "char",
            _value: "box"
          },
          bounds: {
            _obj: "rectangle",
            top: 100,
            left: 100,
            bottom: 125,
            right: 400
          }
        }],
        textStyleRange: [{
          _obj: "textStyleRange",
          from: 0,
          to: textArea.value.length,
          textStyle: {
            _obj: "textStyle",
            fontName: "Arial",
            fontStyleName: "Bold",
            size: {
              _unit: "pointsUnit",
              _value: 16
            }
          }
        }],
        _isCommand: true
      }
    };
    batchPlay([command], {});
  } else if (APP_TYPE === "XD") {
    var _require = __webpack_require__(/*! scenegraph */ "scenegraph"),
        Text = _require.Text,
        Color = _require.Color;

    var _require2 = __webpack_require__(/*! application */ "application"),
        editDocument = _require2.editDocument;

    editDocument(function (selection) {
      var label = new Text();
      label.text = textArea.value;
      label.styleRanges = [{
        fontFamily: "Arial",
        fontStyle: "Bold",
        fontSize: 16,
        fill: new Color("#000")
      }];
      selection.insertionParent.addChild(label);
    });
  }
}
})();

/******/ })()
;
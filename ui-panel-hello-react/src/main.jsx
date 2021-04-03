// // shims, in case they aren't present in the current environment
import React, { useState } from "react";
import { App } from './App'; 
import reactShim from "./util/reactShim";
import ReactDOM from "react-dom";

import {PanelController} from "./controllers/PanelController";
import HelloForm from "../src/components/HelloForm";

const helloPanel = new PanelController(App);

let dialog;
function getDialog() {
    if (dialog == null) {
        dialog = document.createElement("dialog");
        ReactDOM.render(<HelloForm dialog={dialog} />, dialog);
    }
    return dialog;
}

export const commands = {
    menuCommand: function() {
        document.body.appendChild(getDialog()).showModal();
    }
}

export const panels = {
    hello: helloPanel
}
// shims, in case they aren't present in the current environment
require("./util/reactShim");

import React from 'react';
import { App } from './App'; 
import {PanelController} from "./controllers/PanelController";

const helloPanel = new PanelController(App);

export const panels = {
    hello: helloPanel
}
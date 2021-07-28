import React from 'react';
import { entrypoints } from 'uxp';
import { selection } from 'scenegraph';

import HelloForm from './components/HelloForm';
import { App } from './App'; 
import { PanelController } from './controllers/PanelController';
import { CommandController } from './controllers/CommandController';

const com = new CommandController(
    ({ dialog }) => <HelloForm dialog={dialog} />,
    {
        id: "formCommand",
        title: "Command",
        size: { width: 400, height: 400 },
    }
);

const helloPanel = new PanelController(() => <App selection={selection} />, {
    id: "hello"
});

entrypoints.setup({
    plugin: {
        create(plugin) {
            console.log('Plugin was created successfully', plugin);
        }
    },
    panels: {
        hello: helloPanel 
    },
    commands: {
        formCommand: com 
    }
});
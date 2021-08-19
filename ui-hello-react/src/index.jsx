import React from 'react';
import { entrypoints } from 'uxp';

import HelloForm from './components/HelloForm';
import ColorPicker from './components/ColorPicker';
import { PanelController } from './controllers/PanelController';
import { CommandController } from './controllers/CommandController';

const commandExample = new CommandController(
  ({ dialog }) => <HelloForm dialog={dialog} />,
  {
    id: 'formCommand',
    title: 'Command Example',
    size: { width: 400, height: 400 },
  }
);

const helloPanel = new PanelController(() => <ColorPicker />, {
  id: 'hello',
});

entrypoints.setup({
  plugin: {
    create(plugin) {
      console.log('Plugin was created successfully', plugin);
    },
  },
  panels: {
    hello: helloPanel,
  },
  commands: {
    formCommand: commandExample,
  },
});

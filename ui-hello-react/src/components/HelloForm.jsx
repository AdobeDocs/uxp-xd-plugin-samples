import React, { useState } from 'react';
import './HelloForm.css';

import WC from './WC';
import Clock from './Clock';

const HelloForm = ({ dialog }) => {
  const [name, setName] = useState('');

  const onInputChange = (e) => {
    setName(e.target.value);
  };

  const onDoneClick = (e) => {
    dialog.close();
  };

  return (
    <WC onInput={onInputChange}>
      <div className="cell" style={{ width: 300 }}>
        <sp-heading>Example Command</sp-heading>
        <sp-textfield>
          <sp-label slot="label">What is your name?</sp-label>
        </sp-textfield>
        <div className="cell">
          <sp-body>{'Hello ' + name}</sp-body>
        </div>
        <div className="cell">
          <sp-heading>Current Time</sp-heading>
          <Clock />
        </div>
        <sp-button variant="cta" onClick={onDoneClick}>
          Done
        </sp-button>
      </div>
    </WC>
  );
};

export default HelloForm;

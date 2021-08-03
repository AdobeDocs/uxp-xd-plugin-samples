import React, { useEffect, useRef, useState } from 'react';
import { editDocument } from 'application';
import { Color, selection } from 'scenegraph';
import './ColorPicker.css';

import Slider from './Slider';

const ColorPicker = () => {
  const _sldRed = useRef(null);
  const _sldGreen = useRef(null);
  const _sldBlue = useRef(null);
  const _sldAlpha = useRef(null);
  const _textRed = useRef(null);
  const _textGreen = useRef(null);
  const _textBlue = useRef(null);
  const _textAlpha = useRef(null);

  const [red, setRed] = useState(255);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);
  const [alpha, setAlpha] = useState(1);

  const [render, setRender] = useState(false);

  useEffect(() => {
    if (render) {
      updateDocumentColor();
    } else {
      setRender(true);
    }
  }, [red, green, blue, alpha]);

  const updateDocumentColor = () => {
    editDocument({ editLabel: 'Change Colors' }, () =>
      selection.items.forEach(
        (item) =>
          (item.fill = new Color(`rgba(${red}, ${green}, ${blue}, ${alpha})`))
      )
    );
  };

  return (
    <div>
      <div
        className="color"
        style={{
          backgroundColor: `rgba(${red}, ${green}%, ${blue}%, ${alpha})`,
        }}
      ></div>
      <div>
        <Slider
          sliderRef={_sldRed}
          textRef={_textRed}
          label="R"
          max={255}
          value={red}
          unit="red"
          onChange={(e) => {
            setRed(Number(e.target.value));
          }}
        />
        <Slider
          sliderRef={_sldGreen}
          textRef={_textGreen}
          label="G"
          max={255}
          value={green}
          onChange={(e) => {
            setGreen(Number(e.target.value));
          }}
        />
        <Slider
          sliderRef={_sldBlue}
          textRef={_textBlue}
          label="B"
          max={255}
          value={blue}
          onChange={(e) => {
            setBlue(Number(e.target.value));
          }}
        />
        <Slider
          sliderRef={_sldAlpha}
          textRef={_textAlpha}
          label="A"
          max={1}
          step={0.01}
          value={alpha}
          onChange={(e) => {
            setAlpha(Number(e.target.value));
          }}
        />
      </div>
    </div>
  );
};

export default ColorPicker;

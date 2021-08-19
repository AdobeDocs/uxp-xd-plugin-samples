import React from 'react';

import WC from './WC';

const Slider = ({
  label,
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  sliderRef,
  textRef,
} = {}) => {
  return (
    <WC onChange={onChange}>
      <sp-slider
        ref={sliderRef}
        min={min}
        max={max}
        value={value}
        step={(max - min) / 32}
        onChange={(e) => onChange && onChange(e.target.value)}
      >
        <sp-label slot="label">{label}</sp-label>
      </sp-slider>
      <sp-textfield
        quiet
        type="number"
        ref={textRef}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange && onChange(e.target.value)}
      ></sp-textfield>
    </WC>
  );
};

export default Slider;

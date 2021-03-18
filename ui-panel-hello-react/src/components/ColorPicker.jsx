import React from 'react';
import "./ColorPicker.css";

const Slider = ({label, value = 0, min = 0, max = 100, step = 1, unit = "", onChange} = {}) => (
    <label className={styles.slider}>
        <span>{label}</span>
        <input id={`range${label}`} type="range" step={(max-min) / 32} min={min} max={max} value={value} onChange={e => onChange && onChange(e.target.value)} />
        <input id={`input${label}`} type="number" uxp-quiet="true" value={value} min={min} max={max} step={step} onChange={e => onChange && onChange(e.target.value)} />
        { unit && <span>{unit}</span> }
    </label>
);

export const ColorPicker = (props) => {
    const changeRed = (r) => {
        emitChange("r", r);
    }

    const changeGreen = (g) => {
        emitChange("g", g);
    }

    const changeBlue = (b) => {
        emitChange("b", b);
    }

    const changeAlpha = (a) => {
        emitChange("a", a);
    }

    const emitChange = (component, value) => {
        const { onChange } = props;
        const {r, g, b, a} = props;
        if (onChange) {
            onChange(Object.assign({}, {r, g, b, a}, {[component]: value}));
        }
    }

    const { r, g, b, a} = props;

    return (
        <div className="wrapper">
                <div className="color" style={{backgroundColor: `rgba(${r}, ${g}%, ${b}%, ${a})`}}></div>
                <div className="picker">
                    <Slider label="R" max={255} value={r} onChange={changeRed} />
                    <Slider label="G" max={255} value={g} onChange={changeGreen} />
                    <Slider label="B" max={255} value={b} onChange={changeBlue} />
                    <Slider label="A" max={1} step={0.01} value={a} onChange={changeAlpha} />
                </div>
            </div>
    )
}
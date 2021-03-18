import React, { useState } from 'react';

import './App.css';

import Hello from './components/Hello';
import Clock from './components/Clock';
import ColorPicker from './components/ColorPicker';

export const App = (props) => {
    [Color, setColor] = useState({r: 255, g: 0, b: 0, a: 1});

    const documentStateChanged = (selection) => {
        if (selection.items.length > 0) {
            import { Color } from 'scenegraph';
            const color = selection.items[0].fill;
            if (color instanceof Color) {
                setColor({
                        r: color.r, 
                        g: color.g,
                        b: color.b,
                        a: color.a / 255
                    });
            }
        }
    }

    const colorChanged = (color) => {
        // this.setState({
        //     color: {
        //         r: color.r,
        //         g: color.g,
        //         b: color.b,
        //         a: color.a
        //     },
        // }, () => {
        //     const { r, g, b, a } = this.state.color;
        //     const { editDocument } = require("application");
        //     const { selection, Color } = require("scenegraph");
        //     editDocument({editLabel: "Change Colors"}, () => selection.items.forEach(item => item.fill = new Color(`rgba(${r}, ${g}, ${b}, ${a})`)));
        // }
        // );
    }

    const { selection } = props;
    const { r, g, b, a } = Color;
    return (
        <panel className="panel">
            <Hello text="Panels!" />
            <Clock />
            <ColorPicker r={r} g={g} b={b} a={a} onChange={colorChanged} />
        </panel>
    );
}
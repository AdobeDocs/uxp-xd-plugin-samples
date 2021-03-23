import React, { useEffect, useState } from 'react';

import styles from './App.css';

import Hello from './components/Hello';
import Clock from './components/Clock';
import ColorPicker from './components/ColorPicker';

let initialRender = false;

export const App = (props) => {
    const [color, setcolor] = useState({r: 255, g: 0, b: 0, a: 1});

    const documentStateChanged = (selection) => {
        if (selection.items.length > 0) {
            const { Color } = require('scenegraph');
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
        setcolor({r: color.r, g: color.g, b: color.b, a: color.a});
    }

    useEffect(() => {
        const { r, g, b, a} = color;
        const { editDocument } = require("application");
        const { selection, Color } = require("scenegraph");
        if (initialRender) {
            // editDocument({editLabel: "Change Colors"}, () => selection.items.forEach(item => item.fill = new Color(`rgba(${r}, ${g}, ${b}, ${a})`)));
        }
        initialRender = true;
    }, [color])


    const { selection } = props;
    const { r, g, b, a } = color;
    return (
        <panel className={styles.panel}>
            <Hello text="Panels!" />
            <Clock />
            <ColorPicker r={r} g={g} b={b} a={a} onChange={colorChanged} />
        </panel>
    );
}
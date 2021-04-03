import React, { Component } from 'react';
import styles from './App.css';

import Hello from './components/Hello';
import Clock from './components/Clock';
import ColorPicker from './components/ColorPicker';

export class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            color: {
                r: 255,
                g: 0,
                b: 0,
                a: 1,
            },
        };

        this.panel = React.createRef();
        this.documentStateChanged = this.documentStateChanged.bind(this);
        this.colorChanged = this.colorChanged.bind(this);
    }

    documentStateChanged(selection) {
        if (selection.items.length > 0) {
            const { Color } = require('scenegraph');
            const color = selection.items[0].fill;
            if (color instanceof Color) {
                this.setState({
                    color: {
                        r: color.r,
                        g: color.g,
                        b: color.b,
                        a: color.a / 255,
                    },
                });
            }
        }
    }

    colorChanged(color) {

        // FIX ME: replace with useState() hook
        // For more context: https://forums.creativeclouddeveloper.com/t/useeffect-hook-causes-a-panel-plugin-edits-must-be-initiated-from-a-supported-ui-event-error/2720

        this.setState({
            color: {
                r: color.r,
                g: color.g,
                b: color.b,
                a: color.a
            },
        }, () => {
            const { r, g, b, a } = this.state.color;
            const { editDocument } = require("application");
            const { selection, Color } = require("scenegraph");
            editDocument({editLabel: "Change Colors"}, () => selection.items.forEach(item => item.fill = new Color(`rgba(${r}, ${g}, ${b}, ${a})`)));
        }
        );
    }

    render() {
        const { selection } = this.props;
        const {
            color: { r, g, b, a },
        } = this.state;

        return (
            <panel className={styles.panel}>
                <Hello text="Panels!" />
                <Clock />
                <ColorPicker r={r} g={g} b={b} a={a} onChange={this.colorChanged} />
            </panel>
        );
    }
}
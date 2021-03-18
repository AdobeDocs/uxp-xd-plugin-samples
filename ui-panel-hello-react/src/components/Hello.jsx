import React from 'react';

import "./Hello.css";

export const Hello = ({text = "World"} = {}) => (
    <h3 className={styles.hello}>{`Hello, ${text}`.toUpperCase()}</h3>
);

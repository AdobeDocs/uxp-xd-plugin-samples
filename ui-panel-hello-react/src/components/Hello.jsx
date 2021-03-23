import React from 'react';

import styles from "./Hello.css";

const Hello = ({text = "World"} = {}) => (
    <h3 className={styles.hello}>{`Hello, ${text}`.toUpperCase()}</h3>
);

export default Hello;

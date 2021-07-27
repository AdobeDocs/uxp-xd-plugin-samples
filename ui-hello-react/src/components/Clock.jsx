import React, { useEffect, useState } from "react";
import styles from "./Clock.css";

const Clock = (props) => {
    const [Now, setNow] = useState(Date.now());
    let timer = undefined;

    useEffect(() => {
        timer = setInterval(() => update(), 1000);

        return () => {
            clearInterval(timer);
        }
    })

    const update = () => {
        setNow(Date.now());
    }
    const theTime = (new Date(Now)).toLocaleTimeString();
    return (
        <p className={styles.clock}>{theTime}</p>
    );
}

export default Clock;
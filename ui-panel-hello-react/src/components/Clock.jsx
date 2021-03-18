import React, { useEffect, useState } from "react";
import "./Clock.css";

export const Clock = (props) => {
    [Now, setNow] = useState(Date.now());
    const timer = undefined;

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
        <p className="clock">{theTime}</p>
    );
}
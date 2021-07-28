import styles from "./HelloForm.css";
import React, { useState } from "react";

const HelloForm = (props) => {
    const [Name, setName] = useState(props.name || "");

    const onInputChange = (e) => {
        setName(e.target.value);
    }

    const onDoneClick = (e) => {
        props.dialog.close();
    }

    return (
        <form style={{ width: 300 }}>
            <h1>React with JSX Components</h1>
            <label> 
                <span>What is your name?</span>
                <input onChange={onInputChange} />
            </label>
            <p className={styles.text}>{"Hello " + Name}</p>
            <footer>
                <button type="submit" uxp-variant="cta" onClick={onDoneClick}>Done</button>
            </footer>
        </form>   
    )
}

export default HelloForm;
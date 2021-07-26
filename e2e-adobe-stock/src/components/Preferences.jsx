const React = require("react");
const styles = require("./Preferences.css");
const IconButton = require("./IconButton");
const Eyes = require("../assets/eyes.svg").default;

class Preferences extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showKey: false,
            apiKey: undefined
        };

        this.dialog = React.createRef();
        this.apiKey = React.createRef();
        this.cancel = this.cancel.bind(this);
        this.ok = this.ok.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
    }

    cancel() {
        this.dialog.current.close("reasonCanceled");
    }

    ok() {
        const { prefs, onChange } = this.props;

        // setting the api key for the preference will automatically trigger a save
        prefs.apiKey = this.apiKey.current.value;

        // notify any one who cares that we modified the settings
        onChange && onChange(prefs);

        // default action will be to close, so don't worry about it.
    }

    show() {
        document.body.appendChild(this.dialog.current).showModal();
    }

    toggleVisibility() {
        this.setState(
            next => (
                {
                    showKey: !next.showKey,
                    apiKey: this.apiKey.current.value
                }
            ),
            () => {
                this.apiKey.current.focus();
            }
        );
    }

    render() {
        const { prefs } = this.props;
        const { apiKey, showKey } = this.state;

        return (
            <dialog ref={this.dialog}>
                <form method="dialog" onSubmit={this.ok} className={styles.form}>
                    <h1>
                        <a href="https://stock.adobe.com/">
                            <img className={styles.logo} src="./assets/logo.png" />
                        </a>
                    </h1>
                    <hr />
                    <div className={styles.contents}>
                        <p>
                            This plugin requires a valid Adobe Stock API Key. Get&nbsp;<a href="https://console.adobe.io">your Adobe Stock API Key</a> and then paste it in to the field below in order to continue.
                        </p>
                    </div>
                    <label className={`row ${styles.apiKeyField}`}>
                        <span>API Key</span>
                        <input type={showKey ? "text" : "password"} placeholder="API Key" defaultValue={apiKey || prefs.apiKey} ref={this.apiKey} />
                        <IconButton className={styles.eyes} icon={Eyes} title="Toggle key visibility" onClick={this.toggleVisibility} selected={showKey} />
                    </label>
                    <footer>
                        <button uxp-variant="secondary" id="close" onClick={this.cancel}>Don't Change</button>
                        <button uxp-variant="cta" id="ok" type="submit">Save Settings</button>
                    </footer>
                </form>
            </dialog>
        );
    }

}

module.exports = Preferences;
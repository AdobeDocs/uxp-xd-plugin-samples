const secureStorage = require("uxp").storage.secureStorage;
let panel;

function create() {
    const HTML = `
        <style>
            .icon {
                width: 24px;
                height: 24px;
                overflow: hidden;
            }
            #display {
                margin-top: 16px;
                margin-bottom: -16px;
            }
        </style>
        <form method="dialog">
            <sp-textfield  id="securekey">
                <sp-label slot="label">Enter your secure key</sp-label>
            </sp-textfield>
            <sp-body id="display">
            </sp-body>
            <footer>
                <button id="fetch">Fetch Key</button>
                <button type="submit" id="save" uxp-variant="cta">Save Key</button>
            </footer>
        </form>`;

    async function saveSecureKey() {
        const userInput = panel.querySelector("#securekey").value;
        await secureStorage.setItem("secure", userInput);
        panel.querySelector("#securekey").value = "";
    }

    async function fetchSecureKey() {
        // We get the stored value from the secureStorage in the form of a uint8Array.
        const uintArray = await secureStorage.getItem("secure");
        // We convert the uint8Array to a string to present it to the user.
        let secureKey = Array.from(uintArray, i => String.fromCharCode(i)).join("");
        panel.querySelector("#display").textContent = `
        Secure Key entered is ${secureKey}`;
    }

    panel = document.createElement("div");
    panel.innerHTML = HTML;
    panel.querySelector("#save").addEventListener("click", saveSecureKey);
    panel.querySelector("#fetch").addEventListener("click", fetchSecureKey);

    return panel;
}

function show(event) {
// create panel the first time it's shown
    if (!panel) {
        panel = create();
        event.node.appendChild(panel);
    }
}

module.exports = {
    panels: {
        "secure-storage": {
            show
        }
    }
};
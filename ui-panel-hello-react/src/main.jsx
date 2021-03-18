// shims, in case they aren't present in the current environment
require("./util/reactShim");

const App = require("./App");
const PanelController = require("./controllers/PanelController");

const helloPanel = new PanelController(App);

module.exports = {
    panels: {
        hello: helloPanel
    }
};
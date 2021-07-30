# UI HTML Playground

This plugin allows you to enter arbitrary HTML and preview the result within a dialog. You can also execute the last entered code in a dialog without any of the surrounding playground chrome.

## Usage

To edit some HTML in the playground, select **Plugins | UI HTML Playground | Edit...**. You'll be presented with some default HTML in an editor. You can then:

* Edit the HTML as needed (although you may prefer copying and pasting from another editor)
* Click the **Results** tab to see the rendered HTML
    * While in the **Results** tab, you can toggle **Dialog** to toggle the dialog simulation
* Click the **HTML** tab to go back to your code
* Click **Close** to close the dialog

If you want to see your code running in an actual dialog (instead of a simulated dialog), you can select **Plugins | UI HTML Playground | Run...**. Your last entered code will be run within the context of a dialog.

> Note: None of the dialog buttons will work; you'll need to press **ESC** to exit your customized dialog.

## Quirks

* When previewing your code, you're running within `DIV` -- which means you can technically impact the style of the outer chrome. If you do something that completely destroys the layout of the plugin, you will want to reload it in order to restore functionality.

* To set the width of the rendered dialog in "Run" mode, add the following style:

  ```css
  .form {
    width: 360px;
  }
  ```

  This won't be useful for actual dialogs in your own code, but it serves as a hint to the playground what size you want to use.

import {EditorView, basicSetup} from "codemirror"
import {defaultKeymap} from "@codemirror/commands"
import {css} from "@codemirror/lang-css"

document.addEventListener('DOMContentLoaded', function() {
  let initialSource = document.getElementById("prestathema-source").innerText;
  let myView = new EditorView({
    doc: initialSource,
    extensions: [
      basicSetup,
      // keymap.of(defaultKeymap),
      css()
    ],
    parent: document.getElementById("prestathema-editor-pane")
  })
}, false);


console.log("hi from vite and prestathema v1");
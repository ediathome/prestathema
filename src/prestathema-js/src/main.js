import {EditorView, basicSetup} from "codemirror"
import {keymap} from "@codemirror/view"
import {defaultKeymap} from "@codemirror/commands"
import {css} from "@codemirror/lang-css"

class PrestaThemaEditor {
  constructor(parentElement, initialSource) {
    this.container = parentElement;
    this.container.classList.add("bootstrap");

    this.editorPane = document.createElement("div");
    this.editorPane.classList = "panel panel-default";
    this.editorPane.id = "prestathema-editor-pane";
    
    this.editor = new EditorView({
      doc: initialSource,
      extensions: [
        basicSetup,
        keymap.of(defaultKeymap),
        css()
      ],
      parent: this.editorPane
    });

    this.saveButton = document.createElement("button");
    this.saveButton.classList = "btn btn-primary";
    this.saveButton.innerText = "Speichern";

    this.saveButton.addEventListener("click", async function (event) {
      let saveURL = window.location;
      // let saveURL = "http://kbs.test/debug.php";
      
      let documentContents = {
        content: this.editor.state.doc.toString()
      };
    
      // alert("prestathema did call save action \n" + saveURL + "\n\n" + JSON.stringify(documentContents));
      const response = await this.doFetch(
        saveURL,
        'POST',
        JSON.stringify(documentContents)
      );

      if(response.ok) {
        event.target.insertAdjacentHTML("afterend", '<span>👍</span>');
      } else {
        event.target.insertAdjacentHTML("afterend", '<span>⚠️</span>');
        alert("Es ist ein Fehler aufgetreten! Status: " + response.status);
      }
    }.bind(this));

    this.toolbar = document.createElement("div");
    this.toolbar.setAttribute("id", "prestathema-toolbar");
    this.toolbar.classList = "m-4 btn-toolbar panel panel-default";
    this.toolbar.appendChild(this.saveButton);
    
    this.container.appendChild(this.editorPane);
    this.container.appendChild(this.toolbar);
  }
  
  async doFetch (url, method, body, headers=false) {
  if(!headers) {
    headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      'X-Requested-With': 'XMLHttpRequest'
    }
    let csrf = document.querySelector('meta[name="csrf-token"]');
    if(csrf != undefined && csrf.content != undefined) {
      headers['authenticity_token'] = csrf.content;
    }
  }

    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: body,
    });
    return response;
  }
  
}

document.addEventListener('DOMContentLoaded', function() {
  let initialSource = document.getElementById("prestathema-source").innerText;
  let editorPanel = document.getElementById("prestathema-editor");

  if (initialSource != undefined && editorPanel.dataset.displayEditor==1 ) {
    let myView = new PrestaThemaEditor(
      editorPanel, 
      initialSource
    );
  }

}, false);


console.log("hi from vite and prestathema v1");
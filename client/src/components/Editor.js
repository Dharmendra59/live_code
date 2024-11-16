import React, { useEffect, useRef } from 'react'
import "codemirror/mode/javascript/javascript"
import "codemirror/theme/dracula.css"
import "codemirror/addon/edit/closebrackets"
import "codemirror/addon/edit/closetag"
import "codemirror/addon/edit/closebrackets.js"
import "codemirror/addon/edit/matchbrackets.js" 
import "codemirror/addon/hint/show-hint.css"
import "codemirror/addon/hint/show-hint.js"
import "codemirror/lib/codemirror.css"
import "codemirror/mode/htmlmixed/htmlmixed"; 
import CodeMirror from 'codemirror'

const Editor = ({socketRef, roomId, onCodeChange}) => {
      const editorRef = useRef(null);

      useEffect(() => {
         const init =async () => {
            //    const isHTML = window.location.hash === "#html";
               const editor = CodeMirror.fromTextArea(
                  document.getElementById("realTimeEditor"),
                     {
                        mode: {name: "javascript", json: true},
                        theme: "dracula",
                        autoCloseBrackets: true,
                        matchBrackets: true,
                        showHint: true,
                        autoCloseTags: true,
                        lineNumbers: true,
                        lineWrapping: true,
                        matchBrackets: true,
                        smartIndent: true,
                        indentUnit: 2,
                        indentWithTabs: true,
                        autoCloseTags: true,
                        autoCloseBrackets: true,
                        extraKeys: {
                              Tab: function (codeMirror) {
                                    codeMirror.execCommand("indentMore");
                              },
                              "Shift-Tab": function (codeMirror) {
                                    codeMirror.execCommand("indentLess");
                              },
                        },
                        extraKeys: {"Ctrl-Space": "autocomplete"},
                     }
               );
               editorRef.current = editor;
               editor.setSize("100%", "100%");
               editorRef.current.on("change", (instance, changes) => {
                  // console.log("changes", instance, changes);
                  const { origin } = changes;
                  const code = instance.getValue();
                  onCodeChange(code);

                  if(origin !== "setValue") {  
                      socketRef.current.emit("code-change", {roomId, code});
                   }
               })

                            

         }
         init();
      },[]);
      useEffect(() => {
            if (socketRef.current) {
              socketRef.current.on('code-change', ({ code }) => {
                if (code !== null) {
                  editorRef.current.setValue(code);
                }
              });
            }
            return () => {
              socketRef.current.off('code-change');
            };
          }, [socketRef.current]);
  return (
    <div style={{height:"100%"}}>
      <textarea id='realTimeEditor' ></textarea>
    </div>
  )
}

export default Editor

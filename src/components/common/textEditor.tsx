// import { useEffect, useRef } from "react";
// import EditorJS, { OutputData } from "@editorjs/editorjs";
// import Header from "@editorjs/header";
// import EditorjsList from "@editorjs/list";
// import Quote from "@editorjs/quote";
// import Table from "@editorjs/table";

// interface TextEditorProps {
//   data: OutputData | null;
//   onChange: (value: OutputData) => void;
//   editorBlock: string;
//   placeholder?: string;
//   disabled?: boolean;
// }

// const TextEditor = ({
//   data,
//   onChange,
//   editorBlock,
//   placeholder = "Écrivons un text !",
//   disabled,
// }: TextEditorProps) => {
//   const ref = useRef<EditorJS | null>(null);
//   const isInitialized = useRef(false);

//   useEffect(() => {
//     // Prevent double initialization
//     if (isInitialized.current) return;
//     isInitialized.current = true;

//     const initEditor = async () => {
//       // Make sure the DOM element exists
//       const element = document.getElementById(editorBlock);
//       if (!element) return;

//       // Clear any existing content to prevent conflicts
//       element.innerHTML = "";

//       // Create tools configuration with proper typing
//       const toolsConfig: any = {
//         header: {
//           class: Header,
//           shortcut: "CMD+SHIFT+H",
//           config: {
//             placeholder: "Entrez un en-tête",
//             levels: [2, 3, 4],
//             defaultLevel: 4,
//           },
//         },
//         list: {
//           class: EditorjsList,
//           inlineToolbar: true,
//           shortcut: "CMD+SHIFT+L",
//           config: {
//             defaultStyle: "unordered",
//           },
//         },
//         quote: {
//           class: Quote,
//           inlineToolbar: true,
//           shortcut: "CMD+SHIFT+O",
//           config: {
//             quotePlaceholder: "Entrez un citation",
//             captionPlaceholder: "Auteur de citation",
//           },
//         },
//         table: Table,
//       };

//       const textEditor = new EditorJS({
//         holder: editorBlock,
//         tools: toolsConfig,
//         data: data || undefined,
//         placeholder: placeholder,
//         onChange: async (api) => {
//           try {
//             const outputData = await api.saver.save();
//             onChange(outputData);
//           } catch (error) {
//             console.error("L'enregistrement a échoué: ", error);
//           }
//         },
//         readOnly: disabled,
//       });

//       await textEditor.isReady;
//       ref.current = textEditor;
//       isInitialized.current = true;
//     };

//     // Small delay to ensure DOM is ready (reduce delay)
//     // const timeoutId = setTimeout(() => {
//     //   initEditor();
//     // }, 0);
//     initEditor();

//     return () => {
//       if (ref.current) {
//         // clearTimeout(timeoutId);
//         try {
//           ref.current.destroy();
//         } catch (error) {
//           console.error("Erreur lors de la destruction de l'éditeur:", error);
//         } finally {
//           ref.current = null;
//           isInitialized.current = false;
//         }
//       }
//     };
//   }, [editorBlock]); // Only depend on editorBlock

//   return (
//     <div
//       id={editorBlock}
//       className="min-h-[100px] rounded-md border bg-background"
//     />
//   );
// };

// export default TextEditor;

////////////////////////////////

// import { useEffect, useRef } from "react";
// import EditorJS, { OutputData } from "@editorjs/editorjs";
// import Header from "@editorjs/header";
// import EditorjsList from "@editorjs/list";
// import Quote from "@editorjs/quote";
// import Table from "@editorjs/table";

// interface TextEditorProps {
//   data: OutputData | null;
//   onChange: (value: OutputData) => void;
//   editorBlock: string;
//   placeholder?: string;
//   disabled?: boolean;
// }

// const TextEditor = ({
//   data,
//   onChange,
//   editorBlock,
//   placeholder = "Écrivons un text !",
//   disabled,
// }: TextEditorProps) => {
//   const ref = useRef<EditorJS | null>(null);

//   useEffect(() => {
//     let isMounted = true;

//     const initEditor = async () => {
//       if (!isMounted || ref.current) return; // prevent double init

//       const element = document.getElementById(editorBlock);
//       if (!element) return;

//       element.innerHTML = "";

//       const toolsConfig: any = {
//         header: {
//           class: Header,
//           shortcut: "CMD+SHIFT+H",
//           config: {
//             placeholder: "Entrez un en-tête",
//             levels: [2, 3, 4],
//             defaultLevel: 4,
//           },
//         },
//         list: {
//           class: EditorjsList,
//           inlineToolbar: true,
//           shortcut: "CMD+SHIFT+L",
//           config: {
//             defaultStyle: "unordered",
//           },
//         },
//         quote: {
//           class: Quote,
//           inlineToolbar: true,
//           shortcut: "CMD+SHIFT+O",
//           config: {
//             quotePlaceholder: "Entrez une citation",
//             captionPlaceholder: "Auteur de citation",
//           },
//         },
//         table: Table,
//       };

//       const textEditor = new EditorJS({
//         holder: editorBlock,
//         tools: toolsConfig,
//         data: data || undefined,
//         placeholder: placeholder,
//         readOnly: disabled,
//         onChange: async (api) => {
//           try {
//             const outputData = await api.saver.save();
//             onChange(outputData);
//           } catch (error) {
//             console.error("L'enregistrement a échoué:", error);
//           }
//         },
//       });

//       await textEditor.isReady;
//       if (isMounted) {
//         ref.current = textEditor;
//       } else {
//         textEditor.destroy();
//       }
//     };

//     // wait for DOM to settle
//     const timeoutId = setTimeout(initEditor, 0);

//     return () => {
//       isMounted = false;
//       clearTimeout(timeoutId);

//       if (ref.current) {
//         ref.current.destroy();
//         ref.current = null;
//       }
//     };
//   }, [editorBlock]); // re-init only if the block id changes

//   return (
//     <div
//       id={editorBlock}
//       className="min-h-[100px] rounded-md border bg-background"
//     />
//   );
// };

// export default TextEditor;

////////////////////////////

import { useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import EditorjsList from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";

interface TextEditorProps {
  data: OutputData | null;
  onChange: (value: OutputData) => void;
  editorBlock: string;
  placeholder?: string;
  disabled?: boolean;
}

const TextEditor = ({
  data,
  onChange,
  editorBlock,
  placeholder = "Écrivons un text !",
  disabled,
}: TextEditorProps) => {
  const ref = useRef<EditorJS | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initEditor = async () => {
      // Make sure the DOM element exists
      const element = document.getElementById(editorBlock);
      if (!element) return;

      // Clear any existing content to prevent conflicts
      element.innerHTML = "";

      // Create tools configuration with proper typing
      const toolsConfig: any = {
        header: {
          class: Header,
          shortcut: "CMD+SHIFT+H",
          config: {
            placeholder: "Entrez un en-tête",
            levels: [2, 3, 4],
            defaultLevel: 4,
          },
        },
        list: {
          class: EditorjsList,
          inlineToolbar: true,
          shortcut: "CMD+SHIFT+L",
          config: {
            defaultStyle: "unordered",
          },
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: "CMD+SHIFT+O",
          config: {
            quotePlaceholder: "Entrez un citation",
            captionPlaceholder: "Auteur de citation",
          },
        },
        table: Table,
      };

      const textEditor = new EditorJS({
        holder: editorBlock,
        tools: toolsConfig,
        data: data || undefined,
        placeholder: placeholder,
        onChange: async (api) => {
          try {
            const outputData = await api.saver.save();
            onChange(outputData);
          } catch (error) {
            console.error("L'enregistrement a échoué: ", error);
          }
        },
        readOnly: disabled,
      });

      await textEditor.isReady;
      ref.current = textEditor;
      isInitialized.current = true;
    };

    if (disabled) {
      // Small delay to ensure DOM is ready (reduce delay)
      const timeoutId = setTimeout(() => {
        initEditor();
      }, 0);

      return () => {
        if (ref.current) {
          clearTimeout(timeoutId);
          try {
            ref.current.destroy();
          } catch (error) {
            console.error("Erreur lors de la destruction de l'éditeur:", error);
          } finally {
            ref.current = null;
            isInitialized.current = false;
          }
        }
      };
    } else {
      initEditor();

      return () => {
        if (ref.current) {
          try {
            ref.current.destroy();
          } catch (error) {
            console.error("Erreur lors de la destruction de l'éditeur:", error);
          } finally {
            ref.current = null;
            isInitialized.current = false;
          }
        }
      };
    }
  }, [editorBlock]); // Only depend on editorBlock

  return (
    <div
      id={editorBlock}
      className="min-h-[100px] rounded-md border bg-background"
    />
  );
};

export default TextEditor;

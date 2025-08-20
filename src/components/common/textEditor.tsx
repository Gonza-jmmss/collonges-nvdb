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

    // Small delay to ensure DOM is ready (reduce delay)
    // const timeoutId = setTimeout(() => {
    //   initEditor();
    // }, 50);
    initEditor();

    return () => {
      // clearTimeout(timeoutId);
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
  }, [editorBlock]); // Only depend on editorBlock

  return (
    <div
      id={editorBlock}
      className="min-h-[100px] rounded-md border bg-background"
    />
  );
};

export default TextEditor;

/////////////////////////
// "use client";

// import { useEffect, useRef, useCallback } from "react";
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
//   const currentDataRef = useRef<OutputData | null>(data);

//   // Update current data ref when data prop changes
//   useEffect(() => {
//     currentDataRef.current = data;
//   }, [data]);

//   const destroyEditor = useCallback(() => {
//     if (ref.current) {
//       try {
//         ref.current.destroy();
//       } catch (error) {
//         console.error("Erreur lors de la destruction de l'éditeur:", error);
//       } finally {
//         ref.current = null;
//         isInitialized.current = false;
//       }
//     }
//   }, []);

//   const initEditor = useCallback(async () => {
//     // Prevent multiple initializations
//     if (isInitialized.current || ref.current) return;

//     // Make sure the DOM element exists
//     const element = document.getElementById(editorBlock);
//     if (!element) {
//       console.warn(`Element with ID ${editorBlock} not found`);
//       return;
//     }

//     // Clear any existing content to prevent conflicts
//     element.innerHTML = "";

//     // Create tools configuration
//     const toolsConfig: any = {
//       header: {
//         class: Header,
//         shortcut: "CMD+SHIFT+H",
//         config: {
//           placeholder: "Entrez un en-tête",
//           levels: [2, 3, 4],
//           defaultLevel: 4,
//         },
//       },
//       list: {
//         class: EditorjsList,
//         inlineToolbar: true,
//         shortcut: "CMD+SHIFT+L",
//         config: {
//           defaultStyle: "unordered",
//         },
//       },
//       quote: {
//         class: Quote,
//         inlineToolbar: true,
//         shortcut: "CMD+SHIFT+O",
//         config: {
//           quotePlaceholder: "Entrez un citation",
//           captionPlaceholder: "Auteur de citation",
//         },
//       },
//       table: Table,
//     };

//     try {
//       const textEditor = new EditorJS({
//         holder: editorBlock,
//         tools: toolsConfig,
//         data: currentDataRef.current || undefined,
//         placeholder: placeholder,
//         onChange: async (api) => {
//           if (disabled) return; // Don't trigger onChange if disabled
//           try {
//             const outputData = await api.saver.save();
//             onChange(outputData);
//           } catch (error) {
//             console.error("L'enregistrement a échoué: ", error);
//           }
//         },
//         readOnly: disabled,
//         minHeight: 0, // Allow flexible height
//       });

//       await textEditor.isReady;
//       ref.current = textEditor;
//       isInitialized.current = true;
//     } catch (error) {
//       console.error("Erreur lors de l'initialisation de l'éditeur:", error);
//     }
//   }, [editorBlock, placeholder, disabled, onChange]);

//   // Update editor data when data prop changes
//   useEffect(() => {
//     const updateEditorData = async () => {
//       if (ref.current && isInitialized.current) {
//         try {
//           // Clear and render new data
//           await ref.current.render(data || { blocks: [] });
//         } catch (error) {
//           console.error("Erreur lors de la mise à jour des données:", error);
//           // If render fails, reinitialize the editor
//           destroyEditor();
//           setTimeout(() => {
//             initEditor();
//           }, 100);
//         }
//       }
//     };

//     if (
//       isInitialized.current &&
//       JSON.stringify(currentDataRef.current) !== JSON.stringify(data)
//     ) {
//       updateEditorData();
//     }
//   }, [data, destroyEditor, initEditor]);

//   // Initialize editor
//   useEffect(() => {
//     // Add a small delay to ensure DOM is ready
//     const timeoutId = setTimeout(() => {
//       initEditor();
//     }, 100);

//     return () => {
//       clearTimeout(timeoutId);
//       destroyEditor();
//     };
//   }, [editorBlock]); // Only depend on editorBlock

//   return (
//     <div
//       id={editorBlock}
//       className="min-h-[100px] rounded-md border bg-background p-2"
//     />
//   );
// };

// export default TextEditor;

/////////////////////////

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
//   const lastDataRef = useRef<OutputData | null>(null);

//   // Initialize editor only once
//   useEffect(() => {
//     const initEditor = async () => {
//       // Make sure the DOM element exists
//       const element = document.getElementById(editorBlock);
//       if (!element) return;

//       // Clear any existing content to prevent conflicts
//       element.innerHTML = "";

//       // Create tools configuration
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

//       try {
//         await textEditor.isReady;
//         ref.current = textEditor;
//         isInitialized.current = true;
//         lastDataRef.current = data;
//       } catch (error) {
//         console.error("Erreur lors de l'initialisation de l'éditeur:", error);
//       }
//     };

//     if (!isInitialized.current) {
//       initEditor();
//     }

//     return () => {
//       if (ref.current) {
//         try {
//           ref.current.destroy();
//         } catch (error) {
//           console.error("Erreur lors de la destruction de l'éditeur:", error);
//         } finally {
//           ref.current = null;
//           isInitialized.current = false;
//           lastDataRef.current = null;
//         }
//       }
//     };
//   }, [editorBlock]); // Only reinitialize when editorBlock changes

//   // Update data separately
//   useEffect(() => {
//     const updateData = async () => {
//       if (
//         ref.current &&
//         isInitialized.current &&
//         data !== lastDataRef.current
//       ) {
//         try {
//           await ref.current.render(data || { blocks: [] });
//           lastDataRef.current = data;
//         } catch (error) {
//           console.error("Erreur lors de la mise à jour des données:", error);
//         }
//       }
//     };

//     updateData();
//   }, [data]);

//   // Update readOnly state separately
//   useEffect(() => {
//     if (ref.current && isInitialized.current) {
//       try {
//         ref.current.readOnly.toggle(disabled || false);
//       } catch (error) {
//         console.error(
//           "Erreur lors de la mise à jour du mode lecture seule:",
//           error,
//         );
//       }
//     }
//   }, [disabled]);

//   return (
//     <div
//       id={editorBlock}
//       className="min-h-[100px] rounded-md border bg-background"
//     />
//   );
// };

// export default TextEditor;

import { OutputData } from "@editorjs/editorjs";

export const parseEditorData = (
  value: string | null | undefined,
): OutputData | null => {
  if (!value || value.trim() === "") {
    return null;
  }

  try {
    return JSON.parse(value) as OutputData;
  } catch (error) {
    console.error("Échec de la conversion des données de l'éditeur:", error);
    return null;
  }
};

// Helper function to safely stringify EditorJS data
export const stringifyEditorData = (data: OutputData | null): string => {
  if (!data) {
    return "";
  }

  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error("Échec de la conversion des données de l'éditeur:", error);
    return "";
  }
};

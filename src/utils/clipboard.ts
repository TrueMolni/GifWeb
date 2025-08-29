export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!navigator.clipboard) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      return true;
    } catch (error) {
      console.error("Failed to copy using fallback method:", error);
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

export const generateMarkdown = (title: string, url: string): string => {
  const cleanTitle = title.trim() || "GIF";
  return `![${cleanTitle}](${url})`;
};

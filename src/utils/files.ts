export const downloadFile = async (
  url: string,
  filename: string
): Promise<boolean> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

    return true;
  } catch (error) {
    console.error("Failed to download file:", error);
    return false;
  }
};

export const generateFilename = (title: string, id: string): string => {
  const cleanTitle =
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50)
      .trim() || "gif";

  return `${cleanTitle}-${id}.gif`;
};

export function sanitizeDownloadFilePart(name: string): string {
  return name.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 80) || "certificate";
}

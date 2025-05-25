export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, "-") // ersätt mellanslag med bindestreck
    .replace(/[^a-z0-9\-]/g, ""); // ta bort specialtecken
}

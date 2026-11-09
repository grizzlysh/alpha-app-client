export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

// Title-cases a doctor name but keeps the "dr." prefix lowercase.
export function toDoctorName(str: string): string {
  return toTitleCase(str).replace(/^Dr\.(\s|$)/, "dr.$1");
}

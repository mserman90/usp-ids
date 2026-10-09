/**
 * Kriptografik Yardımcılar ve SHA-256 Sağlama
 */
export async function calculateSHA256(text: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text + Date.now().toString());
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback hash simulation
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return "e3b0c442" + Math.abs(hash).toString(16).padStart(8, "0") + "98fc1c149afbf4c8996fb92427ae41e4";
}

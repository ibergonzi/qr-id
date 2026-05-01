export interface PersonData {
  n: string;   // nombre
  l: string;   // apellido
  b: string;   // fecha de nacimiento (YYYY-MM-DD)
  a: string;   // dirección
  e: string;   // email
  p: string;   // teléfono
  w: string;   // whatsapp
  ph: string;  // photo URL (Cloudinary)
  d?: string;  // descripción opcional
}

export function encodePersonData(data: PersonData): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function decodePersonData(encoded: string): PersonData {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const pad = (4 - (base64.length % 4)) % 4;
  const binary = atob(base64 + '='.repeat(pad));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

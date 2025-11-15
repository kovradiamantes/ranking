// auth.js

const API_URL = "https://script.google.com/macros/s/AKfycbwCpLwlPPpiIWhYfL7_YuQqnSdRd4t2gPUtlc_w2VfptlL5iHdgBK0ZVH94knegfzDj/exec";

// Hash simple usando SubtleCrypto (SHA-256)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// Registro
async function register(id, password) {
  const pwHash = await hashPassword(password);
  const body = {
    action: "register",
    id: id,
    password: pwHash
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return data; // { ok: true } o { ok: false, msg: "ID ya registrado" }
}

// Login
async function login(id, password) {
  const pwHash = await hashPassword(password);
  const body = {
    action: "login",
    id: id,
    password: pwHash
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (data.ok) {
    // guardamos sesión
    localStorage.setItem("buzzcast_id", id);
  }
  return data;
}

// Logout
function logout() {
  localStorage.removeItem("buzzcast_id");
}

// Obtener datos del usuario (puntos, nombre, etc)
async function getUserData() {
  const id = localStorage.getItem("buzzcast_id");
  if (!id) return null;

  const body = { action: "getUser", id: id };
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (data.ok) {
    return data; // { ok: true, id, nombre, puntos }
  } else {
    return null;
  }
}

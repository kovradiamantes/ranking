// auth.js

const API_URL = "https://script.google.com/macros/s/AKfycbwCpLwlPPpiIWhYfL7_YuQqnSdRd4t2gPUtlc_w2VfptlL5iHdgBK0ZVH94knegfzDj/exec";

// HASH SHA-256
async function hashPassword(password) {
  const enc = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", enc.encode(password));
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// =======================
//  REGISTER
// =======================
async function registerUser(id, password) {
  const hash = await hashPassword(password);

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "register",
      id,
      password: hash
    })
  });

  return res.json();
}

// =======================
//  LOGIN
// =======================
async function loginUser(id, password) {
  const hash = await hashPassword(password);

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "login",
      id,
      password: hash
    })
  });

  const data = await res.json();

  if (data.ok) {
    localStorage.setItem("buzz_id", id);
  }

  return data;
}

// =======================
//  LOGOUT
// =======================
function logout() {
  localStorage.removeItem("buzz_id");
}

// =======================
//  OBTENER USUARIO
// =======================
async function getUser() {
  const id = localStorage.getItem("buzz_id");
  if (!id) return null;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "getUser",
      id
    })
  });

  const data = await res.json();
  return data.ok ? data : null;
}

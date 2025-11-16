// ===============================
//  CONFIGURACIÓN
// ===============================
const API_URL = "https://script.google.com/macros/s/AKfycbwCpLwlPPpiIWhYfL7_YuQqnSdRd4t2gPUtlc_w2VfptlL5iHdgBK0ZVH94knegfzDj/exec";


// ===============================
//  HASH DE CONTRASEÑA (SHA-256)
// ===============================
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}


// ===============================
//  REGISTRO DE USUARIO
// ===============================
// =======================
// REGISTRO
// =======================
async function registerUser(data) {
  const { id, nombre, password } = data; 
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();

  // ¿Existe ya?
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] == id) {
      return json({ ok: false, msg: "ID ya registrado" });
    }
  }

  // Guardar nuevo usuario: ID, Nombre, Password, puntos, jugados, ganados, estado
  sheet.appendRow([id, nombre, password, 0, 0, 0, "activo"]);

  return json({ ok: true });
}


// ===============================
//  LOGIN
// ===============================
async function loginUser(id, password) {
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
        // guardar sesión en el navegador
        localStorage.setItem("buzz_user", id);
    }

    return data;
}


// ===============================
//  CERRAR SESIÓN
// ===============================
function logoutUser() {
    localStorage.removeItem("buzz_user");
}


// ===============================
//  OBTENER DATOS DEL USUARIO
// ===============================
async function getUserData() {
    const id = localStorage.getItem("buzz_user");
    if (!id) return null;

    const body = {
        action: "getUser",
        id: id
    };

    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    return await res.json();  // { ok:true, user:{...} }
}


// ===============================
//  VERIFICAR SESIÓN ACTIVA
// ===============================
function isLogged() {
    return localStorage.getItem("buzz_user") !== null;
}

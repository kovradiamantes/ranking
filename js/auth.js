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
//  REGISTRO (CLIENTE → SERVIDOR)
// ===============================
async function registerUser(id, nombre, password) {
    const pwHash = await hashPassword(password);

    const body = {
        action: "register",
        id: id,
        nombre: nombre,
        password: pwHash
    };

    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    return await res.json(); // {ok:true} o {ok:false,msg:"..."}
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

    return await res.json();
}


// ===============================
//  VERIFICAR SESIÓN
// ===============================
function isLogged() {
    return localStorage.getItem("buzz_user") !== null;
}

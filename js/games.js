// games.js

import { getUserData } from "./auth.js";

const API_URL = "https://script.google.com/macros/s/AKfycbwCpLwlPPpiIWhYfL7_YuQqnSdRd4t2gPUtlc_w2VfptlL5iHdgBK0ZVH94knegfzDj/exec";

/*
    FUNCIÓN PRINCIPAL PARA CARGAR LOS JUEGOS
*/
export async function loadGamesSection() {
  const user = await getUserData();
  if (!user) {
    alert("Debes iniciar sesión.");
    return;
  }

  const content = document.getElementById("contentArea");
  content.innerHTML = `
    <div style="padding:20px;">
      <h2>Bienvenido, ${user.id}</h2>
      <p>Puntos actuales: <strong id="userPoints">${user.puntos}</strong></p>

      <div style="margin-top:20px;">
        <button id="btnRoulette" class="btn">🎡 Jugar Ruleta (10 puntos)</button>
        <button id="btnChest" class="btn">🎁 Cofre Diario (Gratis)</button>
      </div>

      <div id="gameArea" style="margin-top:30px;"></div>
    </div>
  `;

  document.getElementById("btnRoulette").onclick = () => startRoulette(user.id);
  document.getElementById("btnChest").onclick = () => openDailyChest(user.id);
}

/*
    ⭐ ACTUALIZAR PUNTOS EN LA BASE DE DATOS (Google Sheets)
*/
async function updatePoints(userId, newPoints) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "updatePoints",
      id: userId,
      points: newPoints
    })
  });

  const data = await res.json();
  return data.ok;
}

/*
    🎡 RULETA — RESTA 10 PUNTOS Y DA UN PREMIO ALEATORIO
*/
async function startRoulette(userId) {
  const user = await getUserData();
  let puntos = parseInt(user.puntos);

  if (puntos < 10) {
    alert("No tienes suficientes puntos.");
    return;
  }

  // Se resta el costo del juego
  puntos -= 10;

  // Premios posibles
  const premios = [5, 10, 15, 20, 50, 100];
  const premio = premios[Math.floor(Math.random() * premios.length)];

  const nuevosPuntos = puntos + premio;

  const ok = await updatePoints(userId, nuevosPuntos);

  if (ok) {
    document.getElementById("userPoints").textContent = nuevosPuntos;
    alert(`🎉 Ganaste ${premio} puntos!`);
  } else {
    alert("Error al actualizar los puntos.");
  }
}

/*
    🎁 COFRE DIARIO — SOLO SE ABRE UNA VEZ AL DÍA
*/
async function openDailyChest(userId) {
  const user = await getUserData();
  const puntos = parseInt(user.puntos);

  // Premio del cofre
  const premio = Math.floor(Math.random() * 20) + 10; // entre 10 y 30

  const nuevosPuntos = puntos + premio;

  // Guardar en Google Sheets
  const ok = await updatePoints(userId, nuevosPuntos);

  if (ok) {
    document.getElementById("userPoints").textContent = nuevosPuntos;
    alert(`🎁 Abriste tu cofre diario y ganaste ${premio} puntos!`);
  } else {
    alert("Error al actualizar puntos.");
  }
}

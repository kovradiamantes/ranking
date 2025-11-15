const API_URL = "https://script.google.com/macros/s/AKfycbwCpLwlPPpiIWhYfL7_YuQqnSdRd4t2gPUtlc_w2VfptlL5iHdgBK0ZVH94knegfzDj/exec";

// GET: obtener datos desde Google Sheet
async function apiGet(params = {}) {
    const url = new URL(API_URL);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
        method: "GET",
    });

    return await response.json();
}

// POST: enviar datos a Google Sheet
async function apiPost(body = {}) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    return await response.json();
}

// ===========================
// LOGIN.JS
// ===========================

function loadLogin() {
    fetch("components/login.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("app").innerHTML = html;

            document.getElementById("btn-login").onclick = async () => {
                const id = document.getElementById("login-id").value.trim();
                const pw = document.getElementById("login-password").value;

                if (id === "" || pw === "") {
                    document.getElementById("login-msg").textContent = "Completa todos los campos.";
                    return;
                }

                const res = await loginUser(id, pw);

                if (!res.ok) {
                    document.getElementById("login-msg").textContent = res.msg || "Error en login.";
                    return;
                }

                // Login correcto
                window.location.href = "index.html"; // recarga al panel principal
            };

            // Ir a registro
            document.getElementById("go-register").onclick = () => {
                loadRegister();
            };
        });
}

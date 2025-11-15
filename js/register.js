// ===========================
// REGISTER.JS
// ===========================

function loadRegister() {
    fetch("components/register.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("app").innerHTML = html;

            document.getElementById("btn-register").onclick = async () => {
                const id = document.getElementById("reg-id").value.trim();
                const name = document.getElementById("reg-name").value.trim();
                const pw = document.getElementById("reg-password").value;

                if (id === "" || name === "" || pw === "") {
                    document.getElementById("register-msg").textContent = "Completa todos los campos.";
                    return;
                }

                const res = await registerUser(id, name, pw);

                if (!res.ok) {
                    document.getElementById("register-msg").textContent = res.msg || "Error al registrar.";
                    return;
                }

                // Registro exitoso → volver al login
                alert("Registro completado. Ahora puedes iniciar sesión.");
                loadLogin();
            };

            // Ir al login
            document.getElementById("go-login").onclick = () => {
                loadLogin();
            };
        });
}

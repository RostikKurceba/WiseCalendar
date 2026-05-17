const API =
    "http://localhost:8080/auth";

function goToRegister() {

    window.location.href =
        "register.html";
}

function goToLogin() {

    window.location.href =
        "login.html";
}

async function register() {

    const email =
        document.getElementById(
            "registerEmail"
        ).value;

    const password =
        document.getElementById(
            "registerPassword"
        ).value;

    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        ).value;

    const response = await fetch(
        `${API}/register`,
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                email,
                password,
                confirmPassword
            })
        }
    );

    const result =
        await response.text();

    if(result === "SUCCESS") {

        alert(
            "Акаунт створено!"
        );

        window.location.href =
            "login.html";
    }

    else {

        alert(result);
    }
}

async function login() {

    const email =
        document.getElementById(
            "loginEmail"
        ).value;

    const password =
        document.getElementById(
            "loginPassword"
        ).value;

    const response = await fetch(
        `${API}/login`,
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                email,
                password
            })
        }
    );

    const user =
        await response.json();

    if(user && user.id) {

        localStorage.setItem(
            "userId",
            user.id
        );

        window.location.href =
            "index.html";
    }

    else {

        alert(
            "Неправильний email або пароль"
        );
    }
}
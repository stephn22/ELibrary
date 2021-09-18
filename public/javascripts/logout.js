"use strict";

const logout = document.getElementById("logout");

if (logout) {
    logout.addEventListener("click", () => {
        fetch("/sessions/current", { method: "DELETE" })
            .then(() =>
                window.location = "/login");
    });
}
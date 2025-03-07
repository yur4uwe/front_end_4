document.addEventListener('DOMContentLoaded', function () {
    const router = () => {
        const path = window.location.pathname;
        const routes = ["/"];
        const main = document.getElementById("main");
        main.innerHTML = "";

        if (routes.includes(path)) {
            const page = path === "/" ? "home" : path.split("/")[1];
            switch (page) {
                case "home":
                    main.appendChild(document.createElement("header-component"));
                    main.appendChild(document.createElement("store-page"));
                    main.appendChild(document.createElement("footer-component"));
                    break;
                default:
                    break;
            }
        } else {
            navigate("/");
        }
    }

    window.addEventListener("popstate", router);

    router();
});

/**
 * @param {string} path 
 */
const navigate = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
};

export { navigate };
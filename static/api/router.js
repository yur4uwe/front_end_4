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
                    const header = document.createElement("header-component")
                    const footer = document.createElement("footer-component");
                    const store = document.createElement("store-page")

                    main.append(header, store, footer);
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
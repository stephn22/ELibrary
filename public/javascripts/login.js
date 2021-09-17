"use strict";

import bootstrap from "bootstrap";

const triggerTabList = [].slice.call(document.querySelectorAll("#myTab a"));
triggerTabList.forEach(function (triggerEl) {
    const tabTrigger = new bootstrap.Tab(triggerEl);

    triggerEl.addEventListener("click", function (event) {
        event.preventDefault()
        tabTrigger.show()
    });
});
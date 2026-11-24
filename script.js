"use strict";

const STORAGE_KEY = "rockBlogOpinions";

let opinions = [];
if (localStorage[STORAGE_KEY]) {
    opinions = JSON.parse(localStorage[STORAGE_KEY]);
}

window.addEventListener("load", () => {
    const form = document.getElementById("opinionForm");
    form.addEventListener("submit", processOpnFrmData);
});

function processOpnFrmData(event) {
    event.preventDefault();

    const form = event.target;

    const newOpinion = {
        name: form.elements["meno"].value.trim(),
        email: form.elements["email"].value.trim(),
        imageUrl: form.elements["obrazok"].value.trim(),
        keywords: form.elements["kluc-slova"].value.trim(),
        genre: form.elements["zaner"].value,
        newsletter: form.elements["odber"].checked,
        comment: form.elements["nazor"].value.trim(),
        created: new Date()
    };

    opinions.push(newOpinion);
    localStorage[STORAGE_KEY] = JSON.stringify(opinions);

    console.log("Nový názor uložený:", newOpinion);
    console.log("Všetky názory:", opinions);

    form.reset();
    window.alert("Ďakujem za tvoj názor!");
}
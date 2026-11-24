const STORAGE_KEY = "rockBlogOpinions";

const GENRES = {
    klasicky: "Klasický rock",
    metal: "Metal",
    punk: "Punk / alternatíva"
};

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export default class OpinionsHandler {

    constructor(opinionsFormElmId, opinionsListElmId) {
        this.opinions = [];
        this.opinionsElm = document.getElementById(opinionsListElmId);
        this.opinionsFrmElm = document.getElementById(opinionsFormElmId);
    }

    init() {
        if (localStorage[STORAGE_KEY]) {
            this.opinions = JSON.parse(localStorage[STORAGE_KEY]);
        }
        this.opinionsElm.innerHTML = this.opinionArray2html(this.opinions);
        this.opinionsFrmElm.addEventListener("submit", event => this.processOpnFrmData(event));
    }

    processOpnFrmData(event) {
        event.preventDefault();

        const form = this.opinionsFrmElm;

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

        this.opinions.push(newOpinion);
        localStorage[STORAGE_KEY] = JSON.stringify(this.opinions);
        this.opinionsElm.innerHTML += this.opinion2html(newOpinion);
        form.reset();
    }

    opinion2view(opinion) {
        return {
            name: opinion.name,
            email: opinion.email,
            imageUrl: opinion.imageUrl,
            hasImage: Boolean(opinion.imageUrl),
            keywords: opinion.keywords,
            hasKeywords: Boolean(opinion.keywords),
            genreLabel: GENRES[opinion.genre] ?? opinion.genre,
            newsletterMessage: opinion.newsletter
                ? "Chce dostávať novinky o blogu."
                : "Novinky o blogu nechce dostávať.",
            comment: opinion.comment,
            createdDate: new Date(opinion.created).toLocaleDateString("sk-SK")
        };
    }

    opinion2html(opinion) {
        const v = this.opinion2view(opinion);

        return `
            <section class="opinion">
                <h4>${escapeHtml(v.name)} <i>(${v.createdDate})</i></h4>
                ${v.hasImage
                    ? `<img class="opinion-img" src="${escapeHtml(v.imageUrl)}" alt="Obrázok od ${escapeHtml(v.name)}">`
                    : ""}
                <p>${escapeHtml(v.comment)}</p>
                <ul>
                    <li>E-mail: ${escapeHtml(v.email)}</li>
                    <li>Obľúbený podžáner: ${escapeHtml(v.genreLabel)}</li>
                    ${v.hasKeywords ? `<li>Kľúčové slová: ${escapeHtml(v.keywords)}</li>` : ""}
                    <li>${v.newsletterMessage}</li>
                </ul>
            </section>`;
    }

    opinionArray2html(sourceData) {
        return sourceData.reduce(
            (htmlWithOpinions, opn) => htmlWithOpinions + this.opinion2html(opn), "");
    }
}
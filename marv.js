"use strict";

// ============ DONNEES MUSICALES ============
// Ce tableau sera mis a jour automatiquement par l'APK via GitHub
const TITRES = [];

let musiqueFiltree = [...TITRES];
let categorieActuelle = "tous";
let contactSelectionne = null;

// Contacts actifs
const CONTACTS_ACTIFS = ["whatsapp", "youtube"];

// ============ NAVIGATION ============
const liensNavigation = document.querySelectorAll("[data-page-nav]");
const pages = document.querySelectorAll("[data-page]");

liensNavigation.forEach(function (lien) {
  lien.addEventListener("click", function () {
    const nomPage = this.textContent.toLowerCase().trim();
    pages.forEach(function (page) {
      const nomPageActuelle = page.dataset.page.toLowerCase().trim();
      if (nomPage === nomPageActuelle) {
        page.classList.add("actif");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        page.classList.remove("actif");
      }
    });
    liensNavigation.forEach(function (nav) {
      nav.classList.remove("actif");
      nav.removeAttribute("aria-current");
    });
    this.classList.add("actif");
    this.setAttribute("aria-current", "page");
  });
});

// ============ AFFICHAGE DES MUSIQUES ============
const listeMusique = document.getElementById("liste-musique");

function afficherMusiques() {
  listeMusique.innerHTML = "";
  if (musiqueFiltree.length === 0) {
    return;
  }

  musiqueFiltree.forEach(function (musique, index) {
    const li = document.createElement("li");
    li.className = "item-musique";
    li.innerHTML = `
      <div class="musique-info">
        <span class="musique-nom">${musique.nom}</span>
      </div>
      <div class="musique-actions">
        <span class="musique-duree">${musique.duree}</span>
        <button class="btn-ecouter-musique" data-index="${index}">Ecouter</button>
      </div>
    `;
    listeMusique.appendChild(li);
  });

  document.querySelectorAll(".btn-ecouter-musique").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const idx = parseInt(this.dataset.index);
      const musique = musiqueFiltree[idx];
      const originalIndex = TITRES.indexOf(musique);
      if (originalIndex !== -1) {
        const audioUrl = musique.filename ? 
          "https://raw.githubusercontent.com/Johanes-mg/Marvonthbeat/main/audio/" + musique.filename :
          null;
        if (audioUrl) {
          window.open(audioUrl, "_blank");
        } else {
          alert("Lecture de " + musique.nom + " (fichier non disponible)");
        }
      }
    });
  });
}
afficherMusiques();

// ============ RECHERCHE ============
function rechercherTitre() {
  const input = document.getElementById("recherche-input");
  const terme = input.value.toLowerCase().trim();

  if (terme === "") {
    musiqueFiltree = TITRES.filter(function (m) {
      if (categorieActuelle === "tous") return true;
      return m.categorie === categorieActuelle;
    });
  } else {
    musiqueFiltree = TITRES.filter(function (m) {
      const matchCategorie =
        categorieActuelle === "tous" || m.categorie === categorieActuelle;
      const matchNom = m.nom.toLowerCase().includes(terme);
      return matchCategorie && matchNom;
    });
  }
  afficherMusiques();
}

const rechercheInput = document.getElementById("recherche-input");
if (rechercheInput) {
  rechercheInput.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      rechercherTitre();
    }
  });
}

// ============ FILTRES ============
function filtrerParCategorie(categorie) {
  categorieActuelle = categorie;

  document.querySelectorAll(".filtre-btn").forEach(function (btn) {
    btn.classList.remove("actif");
    if (btn.dataset.categorie === categorie) {
      btn.classList.add("actif");
    }
  });

  const input = document.getElementById("recherche-input");
  const terme = input ? input.value.toLowerCase().trim() : "";

  if (terme === "") {
    musiqueFiltree = TITRES.filter(function (m) {
      if (categorie === "tous") return true;
      return m.categorie === categorie;
    });
  } else {
    musiqueFiltree = TITRES.filter(function (m) {
      const matchCategorie = categorie === "tous" || m.categorie === categorie;
      const matchNom = m.nom.toLowerCase().includes(terme);
      return matchCategorie && matchNom;
    });
  }
  afficherMusiques();
}

// ============ CONTACT ============
function selectionnerContact(methode) {
  if (!CONTACTS_ACTIFS.includes(methode)) {
    alert("Ce moyen de contact n'est pas encore disponible.");
    return;
  }

  contactSelectionne = methode;

  document.querySelectorAll(".contact-item").forEach(function (item) {
    item.classList.remove("selectionne");
    if (item.dataset.contact === methode) {
      item.classList.add("selectionne");
    }
  });

  const btn = document.getElementById("btn-envoyer");
  btn.className = "btn-envoyer " + methode;

  const noms = {
    whatsapp: "WhatsApp",
    email: "Email",
    facebook: "Facebook",
    instagram: "Instagram",
    youtube: "YouTube",
  };
  btn.innerHTML = "<span>Envoyer via " + noms[methode] + "</span>";
}

function envoyerContact() {
  if (!contactSelectionne) {
    alert("Veuillez selectionner un moyen de contact d'abord.");
    return;
  }

  if (!CONTACTS_ACTIFS.includes(contactSelectionne)) {
    alert("Ce moyen de contact n'est pas encore disponible.");
    return;
  }

  const liens = {
    whatsapp: "https://wa.me/261348908400",
    email: "#",
    facebook: "#",
    instagram: "#",
    youtube: "https://www.youtube.com/@MarVOntheBeats",
  };

  if (liens[contactSelectionne] && liens[contactSelectionne] !== "#") {
    window.open(liens[contactSelectionne], "_blank");
  }
}

// ============ THEME ============
let themeSombre = true;

function basculerTheme() {
  const body = document.body;
  const themeIcon = document.getElementById("theme-icon");
  const avatarImg = document.getElementById("avatar-img");

  if (themeSombre) {
    body.classList.add("theme-clair");
    if (themeIcon) {
      themeIcon.src = "./images/icone-lune.png";
    }
    if (avatarImg) {
      avatarImg.src = "./images/avatarnew.png";
    }
    themeSombre = false;
  } else {
    body.classList.remove("theme-clair");
    if (themeIcon) {
      themeIcon.src = "./images/icone-soleil.png";
    }
    if (avatarImg) {
      avatarImg.src = "./images/avatar.png";
    }
    themeSombre = true;
  }
  try {
    localStorage.setItem("theme", themeSombre ? "sombre" : "clair");
  } catch (error) {}
}

try {
  const themeSauvegarde = localStorage.getItem("theme");
  if (themeSauvegarde === "clair") {
    basculerTheme();
  }
} catch (error) {}

// ============ INIT ============
afficherMusiques();

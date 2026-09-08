"use strict";

// ============ DONNÉES MUSICALES ============
// Liste vide pour que Marv puisse importer ses musiques plus tard
const TITRES = [];

let musiqueFiltree = [...TITRES];
let categorieActuelle = "tous";
let contactSelectionne = null;

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
        <button class="btn-ecouter-musique" data-index="${index}">Écouter</button>
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
        alert("Lecture de " + musique.nom + " (simulation)");
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
    alert("Veuillez sélectionner un moyen de contact d'abord.");
    return;
  }

  const liens = {
    whatsapp: "https://wa.me/261XXXXXXXXX",
    email: "mailto:marv@music.com",
    facebook: "https://facebook.com/marvmusic",
    instagram: "https://instagram.com/marv_music",
    youtube: "https://youtube.com/@MarvMusic",
  };

  window.open(liens[contactSelectionne], "_blank");
}

// ============ THÈME ============
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

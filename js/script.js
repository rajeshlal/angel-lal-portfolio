// js/script.js
(function () {
  const grid = document.getElementById("grid");
  const modal = document.getElementById("modal");
  const modalScrim = document.getElementById("modal-scrim");
  const modalClose = document.getElementById("modal-close");
  const modalBody = document.getElementById("modal-body");

  function cardMarkup(item) {
    const media = item.thumb
      ? `<img class="card__thumb" src="${item.thumb}" alt="${item.title}">`
      : `<div class="card__placeholder"><span>${item.title}</span></div>`;

    return `
      <article class="card card--${item.size}" data-id="${item.id}" tabindex="0" role="button" aria-label="Open ${item.title}">
        <span class="card__type card__type--${item.type}">${item.type}</span>
        ${media}
        <div class="card__caption">
          <h3 class="card__title">${item.title}</h3>
          <p class="card__excerpt">${item.excerpt}</p>
        </div>
      </article>
    `;
  }

  function renderGrid() {
    grid.innerHTML = CONTENT.map(cardMarkup).join("");
    grid.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", () => openModal(card.dataset.id));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openModal(card.dataset.id);
        }
      });
    });
  }

  function findItem(id) {
    return CONTENT.find((item) => item.id === id);
  }

  function modalMarkup(item) {
    const media = item.image
      ? `<img class="modal__image" src="${item.image}" alt="${item.title}">`
      : item.type === "photo"
      ? `<div class="card__placeholder card__placeholder--modal"><span>${item.title}</span></div>`
      : "";

    return `
      <span class="card__type card__type--${item.type}">${item.type}</span>
      <h2>${item.title}</h2>
      ${media}
      <div class="modal__text">${item.body}</div>
    `;
  }

  function openModal(id) {
    const item = findItem(id);
    if (!item) return;
    modalBody.innerHTML = modalMarkup(item);
    modal.hidden = false;
    document.body.classList.add("modal-open");
    if (location.hash !== `#${id}`) {
      history.pushState(null, "", `#${id}`);
    }
    modalClose.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (location.hash) {
      history.pushState(null, "", location.pathname + location.search);
    }
  }

  function openFromHash() {
    const id = location.hash.replace("#", "");
    if (id && findItem(id)) openModal(id);
  }

  modalClose.addEventListener("click", closeModal);
  modalScrim.addEventListener("click", closeModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
  window.addEventListener("hashchange", openFromHash);

  renderGrid();
  openFromHash();
})();

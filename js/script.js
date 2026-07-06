// js/script.js
(function () {
  const grid = document.getElementById("grid");

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
  }

  renderGrid();
})();

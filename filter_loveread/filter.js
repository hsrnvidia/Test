// ==UserScript==
// @name         Loveread Felter
// @namespace    http://loveread.ec/
// @version      2
// @description  Фильтр для сайта от 20.06.23
// @author       ibolit
// @match        http://loveread.ec/
// @require      https://rawcdn.githack.com/Mirror45/new/1ad21226a89c1422a5c1ae8ba59f1acce75f60f8/book.min.js
// @license      MIT
// @grant        none
// ==/UserScript==

const templateStyle = `<style>
  .filter {
    width: 96%;
    margin: 20px auto;
    padding: 5px;
    background-color: #f6f6f6;
    border: 1px solid #000;
    box-sizing: border-box;
  }

  .filter button {
    margin-left: 20px;
    background-color: #fff;
    font: inherit;
    color: inherit;
    border: 1px solid #000;
    cursor: pointer;
  }

  .filter button:disabled {
    border-color: transparent;
    background-color: lightgray;
    cursor: auto;
  }
</style>`;

const templateFilter = `<div class="filter">
  <select>
    <option value="1">По просмотрам \u{2193}</option>
    <option value="0" selected>По умолчанию</option>
    <option value="20">Боевики</option>
    <option value="21">Военные</option>
    <option value="3">Детективы</option>
    <option value="24">Детская проза</option>
    <option value="26">Домашняя</option>
    <option value="4">Драма</option>
    <option value="27">Историческая проза</option>
    <option value="6">Классика</option>
    <option value="30">Медицина</option>
    <option value="7">Научная фантастика</option>
    <option value="44">Политика</option>
    <option value="8">Приключение</option>
    <option value="9">Психология</option>
    <option value="5">Романы</option>
    <option value="12">Сказки</option>
    <option value="40">Современная проза</option>
    <option value="14">Триллеры</option>
    <option value="43">Ужасы и мистика</option>
    <option value="16">Фэнтези</option>
    <option value="18">Эротика</option>
    <option value="19">Юмористическая проза</option>
  </select>
  <button data-count="-1" disabled>Назад</button>
  <button data-count="1">Вперед</button>
</div>`;

const table_gl = document.querySelectorAll('.table_gl');

table_gl[0].insertAdjacentHTML('beforebegin', templateStyle + templateFilter);
table_gl[9].insertAdjacentHTML('afterend', templateFilter);

const page = { count: 0, genre: 0 };

const render = ({ genre, count } = page) => {
  const id = book
    .filter(([g]) => genre == 1 || genre == g)
    .slice(count * 10, count * 10 + 10)
    .map(([, , id]) => id);

  id.forEach((e, i) => {
    if (!localStorage.getItem(e)) {
      fetch(`view_global.php?id=${e}`)
        .then((res) => res.arrayBuffer())
        .then((buffer) => new TextDecoder('windows-1251').decode(buffer))
        .then((text) => {
          const section = document.createElement('section');
          section.insertAdjacentHTML('beforeend', text);
          section.querySelector('.td_comment_color').remove();

          localStorage.setItem(
            e,
            (table_gl[i].innerHTML =
              section.querySelector('.table_view_gl').innerHTML)
          );
        });
    } else table_gl[i].innerHTML = localStorage.getItem(e);
  });
};

const select = document.querySelectorAll('select');
const button = document.querySelectorAll('.filter  button');

select.value = () => {
  select.forEach(({value}) => {
    if (value == 0) value = 1;
  });
}

button.disabled = (e) => {
  if (e) page.count = 0;
  button[0].disabled = button[2].disabled = page.count == 0;
}

select.forEach((node) => {
  node.addEventListener('change', (e) => {
    let value = +e.target.value;

    if (!value) return location.reload();

    
    button.disabled(true);
    render();
  });
});

button.forEach((node) => {
  node.addEventListener('click', (e) => {
    const count = +e.target.dataset.count;
    if (count > 0 || (count < 0 && page.count > 0)) {
      select.value();

      page.count += count;
      scroll(0, 0);
      render();
    }
    if (page.count < 2) {
      button.disabled();
    }
  });
});

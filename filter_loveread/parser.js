// ==UserScript==
// @name         Loveread Featch Parser
// @namespace    http://loveread.ec/
// @version      2
// @description  Парсер книг loveread.ec
// @author       ibolit
// @match        http://loveread.ec/
// @license      MIT
// @grant        none
// ==/UserScript==

const page = {
  id: 0,
  book: '',
};

window.book = () => console.log(`const book=[${page.book}];`);

const getBook = (nodes) =>
  [...nodes.querySelectorAll('.table_gl')].reduce((text, node) => {
    return `${text}[${
      {
        Боевики: 20,
        Военные: 21,
        Детективы: 3,
        'Детская проза': 24,
        Домашняя: 26,
        Драма: 4,
        'Историческая проза': 27,
        Классика: 6,
        Медицина: 30,
        'Научная фантастика': 7,
        Политика: 44,
        Приключение: 8,
        Психология: 9,
        Романы: 5,
        Сказки: 12,
        'Современная проза': 40,
        Триллеры: 14,
        'Ужасы и мистика': 43,
        Фэнтези: 16,
        Эротика: 18,
        'Юмористическая проза': 19,
      }[node.querySelector('p').textContent.slice(5)]
    },${+node
      .querySelector('.td_bottom_color p')
      .textContent.match(/\d+/)},${+node
      .querySelector('.td_bottom_color td:last-child a')
      .href.match(/\d+/)}],`;
  }, '');

(function parse(id) {
  fetch(`index_book.php?id_genre=1&p=${id}`)
    .then((res) => res.arrayBuffer())
    .then((buffer) => new TextDecoder('windows-1251').decode(buffer))
    .then((text) => {
      const section = document.createElement('section');
      section.insertAdjacentHTML('beforeend', text);
      page.book += getBook(section);
      if (id > 1) {
        page.id = id - 1;
        setTimeout(parse, 100, page.id);
      }
    });
})(+document.qurtySelector('.current').textContent);

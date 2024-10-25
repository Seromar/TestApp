// Вывод данных из JSON'а. На вход объект из JSON, удовлетворяющий #
function formatJSONData(jsonData) {
    const productsContainer = document.getElementById('products');
    
    jsonData.forEach(function (item) {
        let cardHTML = `
            <div class="card-default-calc align-content-center product mb-2">
                <button class="btn card-header-calc d-flex p-0 m-0 collapsed mb-2" data-bs-toggle="collapse" href="#collapse${item.direction_id}" aria-expanded="false">
                    <div class="px-3 py-2">
                        <div class="hstack gap-2 align-items-baseline py-1">
                            <h2 class="d-flex top-title-prog text-start p-0 m-0 blue-text">${item.code}</h2>
                            <h2 class="d-flex top-title-prog text-start p-0 m-0">${item.title}</h2>
                        </div>
                    </div>
                </button>
                <div id="collapse${item.direction_id}" class="mt-2 collapse" data-bs-parent="#accordion" style="">
                    <div class="card-body list-subprog px-3 pt-1 pb-2 mb-2 d-flex flex-column gap-4">
            `;
        item.eduform_programs.forEach(function (inner) {
            cardHTML += `
                <div class="eduprog_wrapper ${inner.params}">
                    <div class="hstack gap-2 align-items-center mx-3">
                    <p class="m-0">${inner.eduform.charAt(0).toUpperCase() + inner.eduform.slice(1)} форма</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="24" viewBox="0 0 8 24" fill="none">
                        <circle cx="4" cy="12" r="2" fill="#222222"/>
                    </svg>
                    <p class="m-0">${inner.duration}</p>
                    </div>
                    <div class="hstack flex-wrap gap-2 align-items-baseline mx-3">
            `;

            if (inner.plan_budget_full !== null) {
                cardHTML += `<p class="txt-body f-medium d-inline pe-3">Бюджет:&nbsp${inner.plan_budget_full}</p>`;
            }
            if (inner.plan_paid !== null) {
                cardHTML += `<p class="txt-body f-medium d-inline pe-3">Контракт:&nbsp${inner.plan_paid}</p>`;
            }
            if (inner.plan_target !== null) {
                cardHTML += `<p class="txt-body f-medium d-inline pe-3">Целевая квота:&nbsp${inner.plan_target}</p>`;
            }
            if (inner.plan_separate !== null) {
                cardHTML += `<p class="txt-body f-medium d-inline pe-3">Отдельная квота:&nbsp${inner.plan_separate}</p>`;
            }
            if (inner.plan_quota !== null) {
                cardHTML += `<p class="txt-body f-medium d-inline">Особая квота:&nbsp${inner.plan_quota}</p>`;
            }

            cardHTML += `
                </div>
                    <div class="hstack gap-1 align-items-center mx-3 mt-3">
                        <p class="m-0 f-medium blue-text">Образовательные программы:</p>
                    </div>
            `;

            inner.eduprograms.forEach(function (eduprograms) {
                cardHTML += `
                    <a href="https://priem.guap.ru/calc/program_page?textonly&p1=${eduprograms.id}" target="_blank" class="external card-header-calc d-flex col-12 text-start px-3 py-2 mt-2" role="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                `;

                if (eduprograms.department_logo) {
                    cardHTML += `<img src="${eduprograms.department_logo}" style="height: 26px; margin-right: 1em;" alt="logo">`;
                }

                cardHTML += `
                        <p class="prog-name d-inline my-auto">${eduprograms.sz_name}</p>
                    </a>
                `;
            });
            cardHTML += `</div>`;
        });

        cardHTML += `
                    </div>
                </div>
            </div>
        `;

        productsContainer.innerHTML += cardHTML;
    });
}

// Создание dropdown'а для фильтрации
function createDropdown(filterData, filterId, filterTitle) {
    return `
        <div class="dropdown filter mt-1 align-self-stretch flex-fill" id="${filterId}">
        <a class="btn btn-secondary dropdown-toggle ps-4 pe-2 py-1" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            ${filterTitle}
            <svg class="ms-2" xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
                <mask id="mask0_1896_2585" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="37" height="37">
                    <rect width="37" height="37" fill="#D9D9D9"></rect>
                </mask>
                <g mask="url(#mask0_1896_2585)">
                    <g opacity="0.2">
                        <path d="M18.5 23.7033L9.25 14.4533L11.4083 12.2949L18.5 19.3866L25.5917 12.2949L27.75 14.4533L18.5 23.7033Z" fill="#333333"></path>
                    </g>
                </g>
            </svg>
        </a>
        <ul class="dropdown-menu">
            ${filterData.map(value => `
                <li class="dropdown-filter-item">
                    <label class="dropdown-item d-inline-block form-check-label" for="${value.id}">
                        <input class="instituteFilter form-check-input me-2" type="checkbox" value="${value.id}" id="${value.id}">${value.text}
                    </label>
                </li>
            `).join('')}
        </ul>
    </div>
    `;
}

// Создание блока фильтрации
function formatedFilter(item) {
    const filterContainer = document.querySelector('.d-flex.flex-wrap.justify-content-start.gap-2');
    filterContainer.innerHTML = '';  // Очистка контейнера перед добавлением новых элементов

    item.config.forEach(item2 => {
        const filterId = item2.prefix + 'Filters';
        const filterTitle = item2.name;

        const filterData = item2.params.values.map(value => ({
            id: item2.prefix + '_' + (value.id || value.subject_id || value.foreign),
            text: value.foreign !== undefined ? (value.foreign === "true" ? "Да" : "Нет") : (value.text || value.title)
        }));

        const dropdownHTML = createDropdown(filterData, filterId, filterTitle);
        filterContainer.innerHTML += dropdownHTML;
    });

    // Добавляем блок с кнопкой "Сбросить" в конце
    const resetButtonHTML = `
        <div class="mt-1 align-self-stretch flex-fill">
            <button class="btn delete ps-4 pe-3 py-2" type="submit" id="resetFilters">
                Сбросить
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <mask id="mask0_2190_3101" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="28">
                        <rect width="28" height="28" fill="#D9D9D9"></rect>
                    </mask>
                    <g mask="url(#mask0_2190_3101)">
                        <path d="M7.46732 22.1668L5.83398 20.5335L12.3673 14.0002L5.83398 7.46683L7.46732 5.8335L14.0007 12.3668L20.534 5.8335L22.1673 7.46683L15.634 14.0002L22.1673 20.5335L20.534 22.1668L14.0007 15.6335L7.46732 22.1668Z" fill="#333333"></path>
                    </g>
                </svg>
            </button>
        </div>
    `;
    filterContainer.innerHTML += resetButtonHTML;
    preventDropdownClose();
    cleanInputs();
}


function setInnerHTML(elm, html) {
    elm.innerHTML = html;

    Array.from(elm.querySelectorAll("script"))
      .forEach(oldScriptEl => {
          // Проверка src атрибута для игнорирования определённых скриптов
          const src = oldScriptEl.getAttribute('src');
          if (src && src === 'https://src.guap.ru/libs/bootstrap-5.3.3/dist/js/bootstrap.bundle.min.js') {
              return; // Игнорируем скрипт
          }

          const newScriptEl = document.createElement("script");

          Array.from(oldScriptEl.attributes).forEach(attr => {
              newScriptEl.setAttribute(attr.name, attr.value);
          });

          const scriptText = document.createTextNode(oldScriptEl.innerHTML);
          newScriptEl.appendChild(scriptText);

          oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
      });
}

function loadPageContent(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const contentDiv = document.getElementById('OP'); // ID div, в который будем вставлять содержимое
            setInnerHTML(contentDiv,html);

        })
        .catch(error => console.error("Ошибка загрузки страницы:", error));
}

// Функция для добавления обработчиков событий для ссылок
function addLinkClickHandlers() {
    const externalLinks = document.querySelectorAll('.external.card-header-calc');
    externalLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            loadPageContent(this.href); // Загрузка содержимого страницы при клике
        });
    });
}

// Функция для извлечения параметров URL
function getUrlParameters() {
    const url = window.location.href;
    const queryString = url.split('?')[1]?.split('#')[0];
    return new URLSearchParams(queryString);
}

// Функция для выбора чекбоксов и добавления параметров в форму
function selectCheckboxes(params) {
    params.forEach((value, key) => {
        // Выбираем чекбоксы с соответствующими ID
        if (key === 'filter') {
            const checkboxes = document.querySelectorAll(`input[type="checkbox"][id="${value}"]`);
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
        }
        
        // Добавляем параметр в форму, если это не чекбоксы
        if (key === 'search') {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = value;
            }
        }
    });
    filterResult();
    document.getElementById('searchButton').click();
}

// Главная функция, подгружающая данные с JSON-файла, создающая фильтр и выводит направления подготовки
function loadAndProcessJSON() {
    fetch(jsonFilePath)
        .then(response => response.json())
        .then(jsonData => {
            const productsContainer = document.getElementById('products');
            productsContainer.innerHTML = ''; // Очистка контейнера перед добавлением новых элементов
            let logs = 0;
            jsonData.forEach(item => {
                const dropdownToggle = document.querySelector('.dropdown-toggle.mb-3');
                if (dropdownToggle.textContent == item.title) {
                    if (!logs) {
                        formatedFilter(item);
                        logs = 1;
                    }
                    formatJSONData(item.data);
                }
            });
            const params = getUrlParameters();
            selectCheckboxes(params);
            addLinkClickHandlers();
            filterResult();
            cleanInputs();
        })
        .catch(error => console.error("Ошибка загрузки JSON:", error));

}

// Фикс бага с длинным названием направления подготовке в переключателе
function fixDropdownToggleBug() {
    window.onload = function () {
        function handleHashChange() {
            var link = document.querySelector('.dropdown-toggle');
            var text = link.textContent.trim();
            var lastWord = text.match(/[^|\s/]+$/)[0]; // Находим последнее слово с помощью регулярного выражения
            if (lastWord) {
                var newText = text.substring(0, text.length - lastWord.length);
                link.innerHTML = newText + '<span class="no-wrap">' + lastWord + '</span>';
            } else {
                // Если последнее слово не найдено, просто добавляем псевдоэлемент :after
                link.innerHTML += '<span class="no-wrap"></span>';
            }
        }
        // Вызываем функцию при загрузке страницы
        handleHashChange();

        // Добавляем обработчик события hashchange
        window.addEventListener('hashchange', handleHashChange);
    };
}

// Фикс бага с закрытием dropdown'ов
function preventDropdownClose() {
    document.querySelectorAll('.dropdown-menu .form-check-input, .dropdown-menu .form-check-label').forEach(function (element) {
        element.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });
}

// Чистка всех инпутов при нажатии на resetFilters
function cleanInputs() {
    document.getElementById('resetFilters').addEventListener('click', function () {
        const checkboxes = document.querySelectorAll('.d-flex input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        document.getElementById('searchInput').value = '';
        document.getElementById('searchButton').click();
    });
}

function filterResult() {
    document.getElementById('searchButton').addEventListener('click', function (event) {
        event.preventDefault();
        const filters = {};
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        let visibleCount = 0;

        document.querySelectorAll('.dropdown.filter').forEach(dropdown => {
            const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');
            if (checkboxes.length) {
                filters[dropdown.id] = Array.from(checkboxes).map(checkbox => checkbox.value);
            }
        });

        document.querySelectorAll('.card-default-calc').forEach(card => {
            let cardVisible = false;
            const eduprogWrappers = card.querySelectorAll('.eduprog_wrapper');

            eduprogWrappers.forEach(wrapper => {
                let isVisible = true;

                // Фильтр по чекбоксам
                for (const filter in filters) {
                    const filterValues = filters[filter];

                    if (filterValues.some(value => value.startsWith('test_'))) {
                        // Логика для элементов, начинающихся с "test_"
                        const maxPriority = Number((wrapper.classList[wrapper.classList.length - 1]).split('_')[1]);
                        let matchCount = 0;

                        for (let priority = 1; priority <= maxPriority; priority++) {
                            const prefix = 'test';
                            if (filterValues.some(value => {
                                const [testPrefix, priorityValue] = value.split('_');
                                return testPrefix === prefix && wrapper.classList.contains(`${prefix}_${priority}_${priorityValue}`);
                            })) {
                                matchCount++;
                            }
                        }

                        // Проверяем совпадения
                        if (matchCount < Math.min(filterValues.length, maxPriority)) {
                            isVisible = false;
                            break;
                        }
                    } else {
                        // Обычная логика
                        if (!filterValues.some(value => wrapper.classList.contains(value))) {
                            isVisible = false;
                            break;
                        }
                    }
                }

                // Фильтр по тексту
                if (isVisible && searchInput) {
                    const cardHeaderTexts = Array.from(card.querySelectorAll('.hstack h2')).map(h2 => h2.textContent.toLowerCase()).join(' ');
                    if (!cardHeaderTexts.includes(searchInput)) {
                        isVisible = false;
                    }
                }

                if (isVisible) {
                    wrapper.style.display = 'block';
                    cardVisible = true;
                } else {
                    wrapper.style.display = 'none';
                }
            });

            if (cardVisible) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Проверка на наличие вообще каких-либо блоков на странице
        const productsDiv = document.getElementById('products');
        if (visibleCount === 0) {
            if (!document.getElementById('noResultsMessage')) {
                const noResultsMessage = document.createElement('div');
                noResultsMessage.id = 'noResultsMessage';
                noResultsMessage.textContent = 'По вашему запросу ничего не найдено.';
                productsDiv.appendChild(noResultsMessage);
            }
        } else {
            if (document.getElementById('noResultsMessage')) {
                const noResultsMessage = document.getElementById('noResultsMessage');
                noResultsMessage.remove();
            }
        }

        event.preventDefault();

        let searchQuery = document.getElementById('searchInput').value;
        let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
        let params = new URLSearchParams();

        if (searchQuery) {
            params.append('search', searchQuery);
        }

        checkboxes.forEach(function(checkbox) {
            params.append('filter', checkbox.id);
        });

        let queryString = params.toString();
        let hash = window.location.hash;
        let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + queryString + hash;
        window.history.pushState({ path: newUrl }, '', newUrl);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // Таблица соответствия merged_level_id с href
    const hrefMapping = {
        1: '#bach',
        2: '#mag',
        3: '#spo',
        4: '#aspir'
    };

    // Асинхронная функция для последовательного выполнения
    async function initialize() {
        try {
            await loadDropdownData();
            initializeActiveItemHandler(); // Инициализация активного элемента и обработчиков кликов
            loadAndProcessJSON(); // Выполнить функцию при первой загрузке страницы
            fixDropdownToggleBug(); // Выполнить функцию при первой загрузке страницы
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    // Функция для загрузки JSON данных и создания dropdown
    async function loadDropdownData() {
        const response = await fetch(jsonFilePath);
        const data = await response.json();
        const dropdownContainer = document.querySelector('.dropdown_level_wrapper');
        dropdownContainer.innerHTML = createDropdown(data);
    }

    // Функция для создания dropdown из JSON данных с использованием шаблонных строк
    function createDropdown(data) {
        const listItems = data.map(item => `
            <li><a class="dropdown-item filter-toggle" href="${hrefMapping[item.merged_level_id]}">${item.title}</a></li>
        `).join('');

        return `
            <div class="dropdown level">
                <a class="dropdown-toggle mb-3" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ..
                </a>
                <ul class="dropdown-menu px-2">
                    ${listItems}
                </ul>
            </div>
        `;
    }

    // Инициализация активного элемента и обработчиков кликов
    function initializeActiveItemHandler() {
        var dropdownItems = document.querySelectorAll('.filter-toggle');
        var dropdownToggle = document.querySelector('.dropdown-toggle');

        // Функция для установки активного класса и текста dropdown-toggle
        function setActiveItem(hash) {
            dropdownItems.forEach(function (item) {
                if (item.getAttribute('href') === hash) {
                    item.classList.add('active');
                    dropdownToggle.textContent = item.textContent;
                } else {
                    item.classList.remove('active');
                }
            });
        }

        // Если в URL отсутствует хэш, устанавливаем его первый из JSON-файла merged_level_id активным
        fetch(jsonFilePath)
            .then(response => response.json())
            .then(jsonData => {
                if (!window.location.hash) {
                    window.location.hash = hrefMapping[jsonData[0].merged_level_id];
                    setActiveItem(hrefMapping[jsonData[0].merged_level_id]);
                } else {
                    setActiveItem(window.location.hash);
                }
            });

        // Обработчик клика к каждому элементу списка
        dropdownItems.forEach(function (item) {
            item.addEventListener('click', function (event) {
                event.preventDefault();
                window.location.hash = this.getAttribute('href');
                setActiveItem(window.location.hash);
            });
        });
    }

    // Инициализация
    initialize();
});


// Выполнить функцию каждый раз, когда изменяется якорь в URL
window.addEventListener('popstate', function () {
    loadAndProcessJSON();
    fixDropdownToggleBug();
});

(function() {
    // Функция для удаления лишних элементов
    function removeExtraBackdrops() {
        const backdrops = document.querySelectorAll('.offcanvas-backdrop.fade.show');
        if (backdrops.length > 1) {
            for (let i = 1; i < backdrops.length; i++) {
                backdrops[i].remove();
            }
        }
    }

    // Функция для наблюдения за изменениями в конкретном контейнере
    function observeContainer(container) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    removeExtraBackdrops();
                }
            });
        });

        observer.observe(container, { childList: true, subtree: true });
    }

    // Запускаем наблюдение за телом документа
    observeContainer(document.body);

    // Первоначальная проверка на наличие лишних элементов при загрузке скрипта
    removeExtraBackdrops();
})();
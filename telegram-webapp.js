(function() {
    // Проверяем, что Telegram.WebApp доступен
    if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
        const tgWebApp = window.Telegram.WebApp;

        // Функция показа/скрытия кнопки в зависимости от страницы
        function handleBackButtonVisibility() {
            // Проверяем, что мы не на главной
            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                tgWebApp.BackButton.hide();
            } else {
                tgWebApp.BackButton.show();
            }
        }

        // Обработчик нажатия кнопки "Назад"
        tgWebApp.BackButton.onClick(function() {
            // Логика при нажатии (например, вернуть пользователя на предыдущую страницу)
            window.history.back();
        });

        // Изначально задаём видимость кнопки, исходя из текущей страницы
        handleBackButtonVisibility();

        // Если надо повторно вычислять видимость кнопки при смене URL (например, SPA), 
        // вы можете вызывать handleBackButtonVisibility() при соответствующих событиях 
        // (изменении состояния history, переключении роутов и т.п.).

        // Сообщаем Telegram, что WebApp готов к работе (если нужно)
        tgWebApp.ready();
    } else {
        console.log('Telegram WebApp is not available.');
    }
})();
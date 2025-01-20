(function() {
    // Проверяем, что запускаемся в Telegram WebApp
    if (window.Telegram && Telegram.WebApp) {
      const tg = Telegram.WebApp;
  
      // Функция для управления видимостью кнопки "Назад"
      function updateBackButton() {
        // Пример: если URL заканчивается на index.html или корень сайта — считаем, что это главная страница
        // Если у вас другая логика определения главной страницы, отредактируйте условие
        const pathname = window.location.pathname;
        if (pathname === '/' || pathname.endsWith('index.html')) {
          tg.BackButton.hide();
        } else {
          tg.BackButton.show();
        }
      }
  
      // Назначаем обработчик нажатия на кнопку "Назад"
      tg.BackButton.onClick(function() {
        // Вы можете задать свою логику; здесь просто возвращаемся назад в истории браузера
        window.history.back();
      });
  
      // Вызываем управление кнопкой при загрузке страницы
      updateBackButton();
  
      // Если у вас SPA или динамически меняется URL, можно добавить обработчик изменения (например, через popstate)
      window.addEventListener('popstate', updateBackButton);
  
      // Сообщаем Telegram, что приложение готово
      tg.ready();
    } else {
      console.log('Telegram WebApp is not available.');
    }
  })();
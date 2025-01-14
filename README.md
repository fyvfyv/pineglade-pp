# pineglade-pp [![npm version](https://img.shields.io/npm/v/pineglade-pp.svg)](https://www.npmjs.com/package/pineglade-pp)

Модуль для накладывания скриншотов макетов поверх верстаемых страниц.
Позволяет:
* автоматически переключать скриншоты для проверки pixelperfect (далее - PP) при переходе между страницами и сменами адаптивных брейкпоинтов,
* смещать скриншоты, переключать режим инверсии,
* сохранять состояние между перезагрузками страницы и сеансами перезапуска сборки.

## Горячие клавиши

Работают, когда фокус на `<body>`. Результат настроек сохраняется в localStorage.

* `P` - переключение всей функциональности (по умолчанию выключен). При отключении остальные хоткеи не действуют.
* `I` - режим инверсии макетов. По умолчанию включен.
* `R` - при включенном модуле очищает localStorage от данных по смещениям изображений и перезагружает страницу.
* `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` - смещают положение изображения. Настройки сохраняются для каждой страницы и каждого брейкпоинта на ней.

## Установка

Отсутствие изображений PP и кода подключения скрипта в production-режиме - настраивается разработчиком отдельно исходя из возможностей его сборки.
Рекомендуется подключать скрипт внутрь тега `<body>`.

### Прямое подключение скрипта

```html
<script>
  window.pinegladePP = {
    breakpoints: [320, 768, 1260, 1380, 1600],
    folder: 'img/pixelperfect'
  };
</script>
<script src="https://efiand.github.io/pineglade-pp/pineglade-pp.min.js"></script>
```

### Использование модуля

* `npm i -DE https://github.com/efiand/pineglade-pp.git`

* Добавление кода как есть в систему сборки

```js
export * from 'pineglade-pp/loader.js';
```
Опции необходимо добавить вне бандла, как в примере выше.

* Добавление модуля в систему сборки (позволяет сконфигурировать опции внутри бандла):

```js
import loadPP from 'pineglade-pp';

window.pinegladePP = {
  breakpoints: [320, 768, 1260, 1380, 1600],
  folder: 'img/pixelperfect'
};

loadPP();
```

## Настройки

Передаются через объект `window.pinegladePP`. Все настройки опциональны, и если дефолтные подходят, то необходимости создавать объект нет.

* `page` - по умолчанию это URL загруженной страницы от корня (не включая корневой слэш и концевой `.html`, если он там есть). Например, для страницы `/about.html` значение будет `'about'`. Для главной страницы (`/`) - значение по умолчанию `'index'`.
* `breakpoints` - числовой массив ширин макетов (порядок произвольный). При первичной загрузке с определенной шириной окна или при ресайзе происходит смена картинки на подходящую для текущей ширины. Значение по умолчанию: `[320, 768, 1260]`. Если текущая ширина экрана меньше минимального брейкпоинта, фоновое изображение отключается.
* `folder` - имя каталога (относительно корня проекта), где лежат изображения. Значение по умолчанию - `'pixelperfect'`.
* `ext` - расширение изображений (по умолчанию - `'jpg'`).


## Изображения

Формат путей к фоновым изображениям макетов (значения Настроек) - `/<folder>/<page>-<breakpoint>.<ext>`.

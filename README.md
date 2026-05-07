# hrmironenko.ru — статический сайт

## ❓ Это HTML/CSS или Vite/React?

**Чистый HTML/CSS + JS.** Никаких Vite, React, npm install, build-шагов не нужно.
Сайт — это набор статических файлов, которые загружаются в любой хостинг (Selectel S3, Netlify, Vercel, GitHub Pages, обычный VPS) и сразу работают.

Tailwind CSS подключается одной строкой через CDN (`https://cdn.tailwindcss.com`) — компилировать его не надо.

---

## 📁 Структура проекта

```
hrmironenko.ru/
├── index.html           # главная — Елена Мироненко (hero, опыт, направления, публикации, контакты)
├── organizers.html      # страница «Организаторам и журналистам»
├── business.html        # страница «Бизнесу»
├── candidates.html      # страница «Соискателям»
│
├── style.css            # все стили (editorial design system, типографика, кнопки, карточки)
├── main.js              # вся логика (фон, мышиный блик, анимации, mobile-меню, форма)
│
├── robots.txt           # разрешение индексации, ссылка на sitemap
├── sitemap.xml          # карта сайта для поисковиков
│
├── img/                 # все изображения
│   ├── favicon.png      # иконка вкладки
│   ├── og-cover.png     # превью при шаринге в соцсетях (1200×630)
│   ├── elena-hero.png   # фото на главной (hero)
│   └── elena-circle.png # фото в круге секции «На чём основан мой опыт»
│
└── README.md            # этот файл
```

Все пути в HTML — **относительные** (`img/...`, `style.css`, `main.js`). Работают и локально, и на хостинге.

---

## 🚀 Деплой за 2 минуты

### Вариант 1 · Selectel S3 (объектное хранилище)

1. Создайте бакет в Selectel S3 → включите режим «Статический сайт»
2. Загрузите содержимое папки целиком (включая `img/`)
3. Привяжите домен `hrmironenko.ru` к бакету через CNAME
4. Включите бесплатный SSL (Let's Encrypt — встроено в Selectel)

### Вариант 2 · Любой обычный хостинг (FTP / cPanel)

Залейте всю папку в `public_html/` (или `www/`) — готово.

### Вариант 3 · Локально

Откройте `index.html` двойным кликом или через локальный сервер:
```bash
python3 -m http.server 8000
# открыть http://localhost:8000
```

---

## 🔍 SEO — что уже настроено

- **Meta** — `<title>`, `<description>`, `<keywords>`, `<author>`, `canonical` на каждой странице
- **OpenGraph** — для Facebook / LinkedIn / VK / Telegram (ссылка превью с обложкой 1200×630)
- **Twitter Card** — `summary_large_image`
- **Schema.org JSON-LD** — `Person` с именем, должностью, адресом, соцсетями
- **Favicon** — multi-size (16, 32, apple-touch-180)
- **Theme color** — `#000000` для адресной строки в браузере
- **`robots.txt`** — разрешает индексацию всем, указывает на sitemap, для Яндекса добавлен `Clean-param`
- **`sitemap.xml`** — все 4 страницы с приоритетами и датами

После деплоя:
1. Проверьте OG в **opengraph.xyz/url/https://hrmironenko.ru**
2. Отправьте sitemap в **Яндекс.Вебмастер** и **Google Search Console**
3. Опционально: вставьте Яндекс.Метрику — счётчик добавляется одной строкой в `<head>` (см. ниже)

---

## 📊 Подключить Яндекс.Метрику

Внутри `<head>` каждого `*.html` файла добавьте (заменив `XXXXXXXX` на свой ID):

```html
<!-- Yandex.Metrika counter -->
<script type="text/javascript">
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  ym(XXXXXXXX, "init", { clickmap:true, trackLinks:true, accurateTrackBitrate:true, webvisor:true });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/XXXXXXXX" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
```

---

## 🎨 Что внутри стилей

`style.css` содержит:
- Цветовые токены (CSS-переменные)
- Подключение шрифтов: **Manrope** (sans), **Instrument Serif** (italic), **JetBrains Mono** (project codes)
- Editorial design-system: квадратные карточки, чипы, бейджи, моно-лейблы
- Hero-pulse, magnetic buttons, count-up, reveal-маски, view-transitions
- Адаптивность через clamp() и Grid

`main.js` содержит:
- Анимированный фон (статичная сетка + динамический мышиный блик)
- Прогресс-бар скролла
- Magnetic buttons
- Number count-up
- Reveal-маски на скролле
- Parallax портрета
- Page-transitions (View Transitions API + CSS fallback)
- Mobile menu
- Modal с формой
- Smooth-scroll к `#contacts`

Все эффекты уважают `prefers-reduced-motion` — пользователи с этой настройкой видят статичную версию.

---

## ✏️ Как править контент

Контент = обычный HTML внутри `<section>`. Откройте нужный файл (`index.html`, `organizers.html`, и т. д.) в любом редакторе → найдите текст → замените → сохраните → перезалейте файл на хостинг.

### Часто меняемые блоки

- **Главная (`index.html`)**: hero-чипы, описание опыта, ссылки на публикации, контакты
- **Organizers**: таблица событий — секция с `id="events"`, добавляйте `<tr>` для новых выступлений (и одновременно в мобильной версии ниже)
- **Business**: услуги (6 карточек с иконками), условия рекламы TenChat
- **Candidates**: тарифы (2 шт.), 4 площадки

---

## 🧪 Чек-лист перед запуском

- [ ] Заменить `https://hrmironenko.ru/` на ваш реальный домен в `<meta property="og:url">` и `canonical`, если хост другой
- [ ] Положить актуальные картинки в `img/` (`elena-hero.png`, `elena-circle.png`, `favicon.png`, `og-cover.png` 1200×630)
- [ ] Проверить ссылки на публикации в `index.html` (секция «Публикации в СМИ»)
- [ ] Проверить ссылки на события в `organizers.html`
- [ ] Подключить Яндекс.Метрику или Google Analytics
- [ ] Загрузить `sitemap.xml` в Яндекс.Вебмастер и Google Search Console
- [ ] Включить HTTPS на хостинге

---

© 2026 Елена Мироненко. Все права защищены.

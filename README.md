# Мини-проект: React + Express + SQLite

В проекте есть:

- `client` — React-приложение на Vite
- `server` — backend на Node.js + Express
- `server/db/tibet-tours.db` — SQLite-база данных, создаётся автоматически при первом запуске

React не обращается к базе напрямую. Он делает запрос на backend:

```txt
React → GET http://localhost:3001/api/tours → Express → SQLite
```

## Как запустить

### 1. Установить зависимости

Из корневой папки проекта:

```bash
npm install
npm run install:all
```

### 2. Запустить проект

```bash
npm run dev
```

После этого будут запущены:

- backend: http://localhost:3001
- frontend: http://localhost:5173

Открой в браузере:

```txt
http://localhost:5173
```

## Где лежит база данных

После первого запуска сервер создаст файл:

```txt
server/db/tibet-tours.db
```

Именно этот файл можно открыть через SQLite GUI, например DB Browser for SQLite или DBeaver.

## Как проверить API

Открой в браузере:

```txt
http://localhost:3001/api/tours
```

Там должен быть JSON со списком туров.

## Как добавить тур через API

Можно отправить POST-запрос на:

```txt
http://localhost:3001/api/tours
```

Пример тела запроса:

```json
{
  "title": "Озеро Намцо",
  "duration": "5 дней",
  "price": "от 900 €",
  "description": "Короткий маршрут к одному из самых красивых высокогорных озёр Тибета."
}
```

После добавления нужно обновить страницу клиента, чтобы увидеть новый тур.

## Как добавить тур через SQLite GUI

1. Открой файл `server/db/tibet-tours.db` в SQLite GUI.
2. Открой таблицу `tours`.
3. Добавь новую строку.
4. Сохрани изменения.
5. Обнови страницу React-приложения.

React увидит новые данные после повторного GET-запроса к backend.

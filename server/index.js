const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db', 'tibet-tours.db');
const db = new sqlite3.Database(dbPath);

function initDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS tours (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        duration TEXT NOT NULL,
        price TEXT NOT NULL,
        description TEXT NOT NULL
      )
    `);

    db.get('SELECT COUNT(*) AS count FROM tours', (err, row) => {
      if (err) {
        console.error('Ошибка при проверке базы:', err.message);
        return;
      }

      if (row.count === 0) {
        const tours = [
          [
            'Лхаса и дворец Потала',
            '7 дней',
            'от 1200 €',
            'Классический маршрут по Лхасе: дворец Потала, храм Джоканг и старый город.'
          ],
          [
            'К базовому лагерю Эвереста',
            '10 дней',
            'от 1800 €',
            'Путешествие через высокогорные перевалы, монастыри и виды на Эверест.'
          ],
          [
            'Священная гора Кайлас',
            '14 дней',
            'от 2400 €',
            'Маршрут для тех, кто хочет увидеть озеро Манасаровар и пройти кору вокруг Кайласа.'
          ]
        ];

        const insertTour = db.prepare(`
          INSERT INTO tours (title, duration, price, description)
          VALUES (?, ?, ?, ?)
        `);

        tours.forEach((tour) => insertTour.run(tour));
        insertTour.finalize();
      }
    });
  });
}

initDatabase();

app.get('/api/tours', (req, res) => {
  db.all('SELECT * FROM tours ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Не удалось получить туры' });
      return;
    }

    res.json(rows);
  });
});

app.get('/api/gides', (req, res) => {
  db.all('SELECT * FROM gides ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Не удалось получить гида' });
      return;
    }

    res.json(rows);
  });
});

app.post('/api/tours', (req, res) => {
  const { title, duration, price, description } = req.body;

  if (!title || !duration || !price || !description) {
    res.status(400).json({ error: 'Заполните все поля' });
    return;
  }

  const query = `
    INSERT INTO tours (title, duration, price, description)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [title, duration, price, description], function (err) {
    if (err) {
      res.status(500).json({ error: 'Не удалось добавить тур' });
      return;
    }

    res.status(201).json({
      id: this.lastID,
      title,
      duration,
      price,
      description
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`SQLite database: ${dbPath}`);
});

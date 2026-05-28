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

app.get('/api/tours', (req, res) => {
  const query = `
    SELECT
      tours.id,
      tours.title,
      tours.duration,
      tours.price,
      tours.description,
      tours.name,
      tours.gideId,
      tours.id_hotel,

      gides.name AS gide_name,
      gides.motto AS gide_motto,
      gides.img AS gide_img,
      gides.experience AS gide_experience,
      gides.url AS gide_url,
      gides.about AS gide_about,

      hotels.name AS hotel_name,
      hotels.description AS hotel_description

    FROM tours
    LEFT JOIN gides ON tours.gideId = gides.id
    LEFT JOIN hotels ON tours.id_hotel = hotels.id
    ORDER BY tours.id DESC
  `;

  db.all(query, [], (err, rows) => {
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
      res.status(500).json({ error: 'Не удалось получить гидов' });
      return;
    }

    res.json(rows);
  });
});

app.get('/api/hotels', (req, res) => {
  db.all('SELECT * FROM hotels ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Не удалось получить отели' });
      return;
    }

    res.json(rows);
  });
});

app.get('/api/clients', (req, res) => {
  db.all('SELECT * FROM data_clients ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Не удалось получить клиентов' });
      return;
    }

    res.json(rows);
  });
});

app.get('/api/sales', (req, res) => {
  const query = `
    SELECT
      sales.id,

      sales.tours_id,
      tours.title AS tour_title,
      tours.price AS tour_price,

      sales.hotel_id,
      hotels.name AS hotel_name,

      sales.client_id,
      data_clients.name AS client_name,
      data_clients.email AS client_email,
      data_clients.tel AS client_tel

    FROM sales
    LEFT JOIN tours ON sales.tours_id = tours.id
    LEFT JOIN hotels ON sales.hotel_id = hotels.id
    LEFT JOIN data_clients ON sales.client_id = data_clients.id
    ORDER BY sales.id DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Не удалось получить продажи' });
      return;
    }

    res.json(rows);
  });
});

app.post('/api/tours', (req, res) => {
  const {
    title,
    duration,
    price,
    description,
    name,
    gideId,
    id_hotel
  } = req.body;

  if (!title || !duration || !price || !description) {
    res.status(400).json({ error: 'Заполните обязательные поля' });
    return;
  }

  const query = `
    INSERT INTO tours (
      title,
      duration,
      price,
      description,
      name,
      gideId,
      id_hotel
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [title, duration, price, description, name, gideId, id_hotel],
    function (err) {
      if (err) {
        res.status(500).json({ error: 'Не удалось добавить тур' });
        return;
      }

      res.status(201).json({
        id: this.lastID,
        title,
        duration,
        price,
        description,
        name,
        gideId,
        id_hotel
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`SQLite database: ${dbPath}`);
});
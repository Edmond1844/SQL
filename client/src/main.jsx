import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import Gides from "./Gides";

function App() {
  const [tours, setTours] = React.useState([]);
  const [hotels, setHotels] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    Promise.all([
      fetch("http://localhost:3001/api/tours"),
      fetch("http://localhost:3001/api/hotels"),
    ])
      .then(([toursResponse, hotelsResponse]) => {
        if (!toursResponse.ok) {
          throw new Error("Ошибка загрузки туров");
        }

        if (!hotelsResponse.ok) {
          throw new Error("Ошибка загрузки отелей");
        }

        return Promise.all([toursResponse.json(), hotelsResponse.json()]);
      })
      .then(([toursData, hotelsData]) => {
        setTours(toursData);
        setHotels(hotelsData);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  console.log(tours);

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Мини-проект React + Express + SQLite</p>
        <h1>Туры в Тибет</h1>
        <p className="heroText">
          Данные хранятся в SQLite, сервер отдаёт их через API, а React выводит
          карточки туров и гидов.
        </p>
      </section>
      <section>
        <h2>Отели</h2>
        <div className="grid">
          {hotels.map((hotel) => (
            <article className="card" key={hotel.id}>
              <h3>{hotel.name}</h3>
              <p>{hotel.description}</p>
            </article>
          ))}
        </div>
      </section>

      {isLoading && <p className="status">Загружаем данные...</p>}
      {error && <p className="status error">{error}</p>}

      {!isLoading && !error && (
        <>
          <section>
            <h2 className="sectionTitle">Туры</h2>

            <div className="grid">
              {tours.map((tour) => (
                <article className="card" key={tour.id}>
                  <h3>{tour.title}</h3>

                  <div className="meta">
                    <span>{tour.gide_name}</span>
                    <span>{tour.duration}</span>
                    <span>{tour.price}</span>
                    <span>
                      {tour.hotel_name === null
                        ? "Отеля не будет"
                        : tour.hotel_name}
                    </span>
                  </div>

                  <p>{tour.description}</p>
                </article>
              ))}
            </div>
          </section>
          <section>
            <Gides />
          </section>
        </>
      )}
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

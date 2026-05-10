import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

function App() {
  const [tours, setTours] = React.useState([]);
  const [guides, setGuides] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    Promise.all([
      fetch("http://localhost:3001/api/tours"),
      fetch("http://localhost:3001/api/guides"),
    ])
      .then(([toursResponse, guidesResponse]) => {
        if (!toursResponse.ok) {
          throw new Error("Ошибка загрузки туров");
        }

        if (!guidesResponse.ok) {
          throw new Error("Ошибка загрузки гидов");
        }

        return Promise.all([toursResponse.json(), guidesResponse.json()]);
      })
      .then(([toursData, guidesData]) => {
        setTours(toursData);
        setGuides(guidesData);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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
                    <span>{tour.duration}</span>
                    <span>{tour.price}</span>
                  </div>

                  <p>{tour.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="sectionTitle">Гиды</h2>

            <div className="grid">
              {guides.map((guide) => (
                <article className="card" key={guide.id}>
                  <h3>{guide.name}</h3>

                  <div className="meta">
                    <span>{guide.experience}</span>
                    <span>{guide.language}</span>
                  </div>

                  <p>{guide.description}</p>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

import React from "react";

export default function Gides() {
  const [gides, setGides] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetch("http://localhost:3001/api/gides")
      .then(([gidesResponse]) => {
        if (!gidesResponse.ok) {
          throw new Error("Ошибка загрузки гидов");
        }

        return Promise.all([gidesResponse.json()]);
      })
      .then(([gidesData]) => {
        setGides(gidesData);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  console.log(gides);
  return (
    <>
      <h2 className="sectionTitle">Гиды</h2>

      <div className="grid">
        {gides.map((guide) => (
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
    </>
  );
}

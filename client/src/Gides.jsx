export default function Gides() {
  const [tours, setTours] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetch("http://localhost:3001/api/gides")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка загрузки гидов");
        }

        return response.json();
      })
      .then((data) => {
        setTours(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <h1>Гиды</h1>
    </>
  );
}

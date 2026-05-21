export default function Hoteles() {
  const [hoteles, setHoteles] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetch("http://localhost:3001/api/hoteles").then((response) => {
      return response.json();
    });
    return (
      <>
        <h1>Hotel</h1>
        <div></div>
      </>
    );
  });
}

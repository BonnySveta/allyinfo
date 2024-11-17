export function Podcasts() {
  const podcastsList = [
    {
      title: "Инклюзивный ананас",
      url: "https://inclusivepineapple.github.io/",
      description: "Подкаст о цифровой доступности от Глаши Жур и Тани Фокиной"
    }
    // Здесь можно добавить другие подкасты
  ];

  return (
    <div>
      <h1>Подкасты</h1>
      <p>Подкасты на тему цифровой доступности</p>
      <ul>
        {podcastsList.map((podcast, index) => (
          <li key={index}>
            <a href={podcast.url} target="_blank" rel="noopener noreferrer">
              {podcast.title}
            </a>
            <p>{podcast.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
} 
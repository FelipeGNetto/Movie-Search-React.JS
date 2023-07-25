import React, { useState } from 'react';

const api_key = "0b32506f3de12f826e246902147beec2";
const url = "https://api.themoviedb.org/3";

function SearchMovie() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trailerKeys, setTrailerKeys] = useState({});
  const [moviesWithoutTrailers, setMoviesWithoutTrailers] = useState([]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    searchMovies();
  };

  const searchMovies = () => {
    const searchUrl = `${url}/search/movie?api_key=${api_key}&language=pt-BR&query=${searchTerm}&page=1`;

    fetch(searchUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na chamada da API');
        }
        return response.json();
      })
      .then(data => {
        setSearchResults(data.results);
        setTrailerKeys({});
        setMoviesWithoutTrailers([]);
        console.log(data)
      })
      .catch(error => {
        console.error('Erro:', error.message);
      });
  };

  const getMovieTrailer = (movieId) => {
    const trailerUrl = `${url}/movie/${movieId}/videos?api_key=${api_key}&language=pt-BR`;

    fetch(trailerUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na chamada da API');
        }
        return response.json();
      })
      .then(data => {
        const trailer = data.results.find(video => video.type === 'Trailer');
        if (trailer) {
          setTrailerKeys(prevState => ({
            ...prevState,
            [movieId]: trailer.key,
          }));
        } else {
          setTrailerKeys(prevState => ({
            ...prevState,
            [movieId]: '',
          }));
          setMoviesWithoutTrailers(prevState => [...prevState, movieId]);
        }
      })
      .catch(error => {
        console.error('Erro ao obter o trailer:', error);
        setTrailerKeys(prevState => ({
          ...prevState,
          [movieId]: '',
        }));
        setMoviesWithoutTrailers(prevState => [...prevState, movieId]);
      });
  };

  return (
    <div>
      <div className='box'>
      <div className='box-title'>
        <h1>Search Movie</h1>
      </div>
      <div className='box-form'>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Digite o nome do filme..."
        />
        <button type="submit">Pesquisar</button>
      </form>
      </div>
      </div>
      <div className='container'>
        {searchResults.map(movie => (
          <div className='movieContent' key={movie.id}>
            <h2>{movie.title}</h2>
            <div className='pContent'>
            <p>{movie.overview}</p>
            </div>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <p id='data'><b>Data de lançamento: </b>{movie.release_date}</p>
            <button onClick={() => getMovieTrailer(movie.id)}>Ver Trailer</button>
            {trailerKeys[movie.id] ? (
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${trailerKeys[movie.id]}`}
                title="Trailer do Filme"
                allowFullScreen
              />
            ) : null}
            {moviesWithoutTrailers.includes(movie.id) && (
              <p>Este filme não tem trailer</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchMovie;

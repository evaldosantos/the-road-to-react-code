import React from 'react';
import axios from 'axios';

import './App.css';

import storiesReducer from './storiesReducer';
import useSemiPersistentState from './useSemiPersistentState';
import SearchForm from './SearchForm';
import List from './List';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

function App() {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  )

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };
  
  const handleSearchSubmit = event => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [], isLoading: false, isError: false
  });

  const handleRemoveStory = item => {
    dispatchStories({ type: 'REMOVE_STORY', payload: item });
  };

  const handleFetchStories = React.useCallback(() => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    axios.get(url)
      .then(result => {
        dispatchStories({ type: 'STORIES_FETCH_SUCCESS', payload: result.data.hits });  
      })
      .catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE'}));
    
  }, [searchTerm])
  
  React.useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories])

  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>

      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit} />
      
      <hr />
      { stories.isError && <p>Something went wrong ...</p>}
      
      { stories.isLoading ? <p>Loading ...</p> : <List list={stories.data} onRemoveItem={handleRemoveStory} /> }
    </div>
  );
}

export default App;

import React from 'react';
import axios from 'axios';

import storiesReducer from './storiesReducer';
import useSemiPersistentState from './useSemiPersistentState';
import InputWithLabel from './InputWithLabel';
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
  
    const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
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
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearchInput}
        isFocused
      >
        <strong>Search</strong>
      </InputWithLabel>

      <button
        type="button"
        disabled={!searchTerm}
        onClick={handleSearchSubmit}
      >
        Submit
      </button>
      <hr />
      { stories.isError && <p>Something went wrong ...</p>}
      
      { stories.isLoading ? <p>Loading ...</p> : <List list={stories.data} onRemoveItem={handleRemoveStory} /> }
    </div>
  );
}

export default App;

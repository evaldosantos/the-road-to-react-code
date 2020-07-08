import React from 'react';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const storiesReducer = (state, action) => {
  switch( action.type ) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: false,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(story => story.objectID !== action.payload.objectID)
      };
    default: 
      throw new Error();
  }
}

const useSemiPersistentState = (key, initialState='React') => {
  const [value, setvalue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setvalue];
}

function getTitle(title) {
  return title;
}

const Item = ({ item, onRemoveItem }) => (
  <div>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={onRemoveItem.bind(null, item)}>
        Dismiss
      </button>
    </span>
  </div>
);

const List = ({ list, onRemoveItem }) => {
  return list.map(item => <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />)
}

const InputWithLabel = ({
  id,
  children,
  value,
  type = 'text',
  onInputChange,
  isFocused
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if ( isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused])

  return (
    <>
      <label htmlFor={id}>{children}</label>
        &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
}

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

function App() {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const getAsyncStories = () => new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { stories: initialStories } })
    }, 2000)
  });

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [], isLoading: false, isError: false
  });

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handleRemoveStory = item => {
    dispatchStories({ type: 'REMOVE_STORY', payload: item });
  };

  const searchedStories = stories.data.filter(function(story) {
    return story.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  React.useEffect(() => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    fetch(`${API_ENDPOINT}react`)
      .then(response => response.json())
      .then(result => {
        dispatchStories({ type: 'STORIES_FETCH_SUCCESS', payload: result.hits });  
      })
      .catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE'}));
    
  }, [])

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearch}
        isFocused
      >
        <strong>Search</strong>
      </InputWithLabel>
      <hr />
      { stories.isError && <p>Something went wrong ...</p>}
      
      { stories.isLoading ? <p>Loading ...</p> : <List list={searchedStories} onRemoveItem={handleRemoveStory} /> }
    </div>
  );
}

export default App;

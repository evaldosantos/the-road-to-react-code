import React from 'react';

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

  const [stories, setStories] = React.useState([]);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handleRemoveStory = item => {
    const newStories = stories.filter(
      story => item.objectID !== story.objectID
    );
    setStories(newStories);
  };

  const searchedStories = stories.filter(function(story) {
    return story.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  React.useEffect(() => {
    getAsyncStories().then(result => {
      setStories(result.data.stories);
    })
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
      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
    </div>
  );
}

export default App;

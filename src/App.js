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

const Item = ({ item }) => (
  <div>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </div>
);

const List = ({ list }) => {
  return list.map(item => <Item key={item.objectID} item={item} />)
}

const Search = ({ onSearch, searchTerm }) => {
  

  const handleChange = event => {
    onSearch(event);
  };

  return <>
    <label htmlFor="search">Search: </label>
    <input id="search" type="text" onChange={handleChange} value={searchTerm} />
    <p>
    Searching for <strong>{searchTerm}</strong>.
    </p>
  </>
}

function App() {
  const stories = [
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

  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  

  const searchedStories = stories.filter(function(story) {
    return story.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1>Hello {getTitle('React')}</h1>
      <Search onSearch={handleSearch} searchTerm={searchTerm} />
      <hr />
      <List list={searchedStories} />
    </div>
  );
}

export default App;

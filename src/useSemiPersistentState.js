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

export default useSemiPersistentState;
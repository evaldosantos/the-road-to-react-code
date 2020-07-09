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

export default storiesReducer;
import {
  SEARCH_SHOWS,
  SET_LOADING,
  SET_SINGLE_SHOW,
  CLEAR_SINGLE_SHOW,
} from "../types";
import axios from "axios";
import ShowsReducer from "./showsReducer"
import AppContext from "../Shows/showsContext"
import { useReducer } from "react";

const ShowsState = ({children}) => {
  const initialState = {
    shows: [],
    singleShow: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(ShowsReducer, initialState);

  const searchShows = async (searchTerm) => {
    dispatch({ type: SET_SINGLE_SHOW });
    const { data } = await axios.get(
      `https://api.tvmaze.com/search/shows?q=${searchTerm}`
    );

    dispatch({
      type: SEARCH_SHOWS,
      payload: data,
    });
  };

  const getShowPage = async (id) => {
    dispatch({
      type: SET_LOADING,
    });
    const { data } = await axios.get(`https://api.tvmaze.com/shows/${id}`);

    dispatch({
      type: SET_SINGLE_SHOW,
      payload: data
    })
  }

  const clearShowPage = () => {
    dispatch({
      type: CLEAR_SINGLE_SHOW
    })
  }

  return (
    <AppContext.Provider
      value={{
        shows: state.shows,
        singleShow: state.singleShow,
        loading: state.loading,
        searchShows,
        getShowPage,
        clearShowPage,
      
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ShowsState;

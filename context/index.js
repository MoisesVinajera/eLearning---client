import { useReducer, createContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

// initial state
const initialState = {
  user: null,
};

// create context
const Context = createContext();

// root reducer
const rootReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

// context provider
const Provider = ({ children }) => {
  //component state
  const [state, dispatch] = useReducer(rootReducer, initialState);

  // router
  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: 'LOGIN',
      payload: JSON.parse(window.localStorage.getItem('user')),
    });
  }, []);

  axios.interceptors.response.use(
    (response) => {
      //any status code that lie within  the range of 2XX cause this function to trigger
      return response;
    },
    (error) => {
      // any status code that falls outside  the range of 2XX cause this function to trigger
      let res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
          axios
            .get('/api/logout')
            .then((data) => {
              console.log('401 ERROR');
              dispatch({ type: 'LOGOUT' });
              window.localStorage.removeItem('user');
              router.push('/login');
            })
            .catch((err) => {
              console.log('AXIOS INTERCEPTORS ERROR', err);
              reject(err);
            });
        });
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get('/api/csrf-token');
      axios.defaults.headers[('X-CSRF-TOKEN', data.getCsrfToken)];
    };
    getCsrfToken();
  }, []);

  const value = { state, dispatch };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export { Context, Provider };
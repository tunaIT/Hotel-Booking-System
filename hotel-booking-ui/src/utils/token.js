import Cookies from 'js-cookie';

export const setToken = (token) => {
  Cookies.set('access_token', token, { expires: 1 }); // 1 day expiration
};

export const getToken = () => {
  return Cookies.get('access_token');
};

export const removeToken = () => {
  Cookies.remove('access_token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

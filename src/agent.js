import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

import { parseJwt } from './utils';

const superagent = superagentPromise(_superagent, global.Promise);

let API_ROOT = "http://192.192.7.224:8000/api/v1";
const responseBody = res => res.body;
const errorBody = err => err.message;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
};

const Auth = {
  login: (values) =>
    requests.post('/auth/login', values),
  register: (values) =>
    requests.post('/auth/register', values),
  current: () =>
    parseJwt(token),
};
const User = {
};

export default {
  Auth,
  User,
  setToken: _token => { token = _token; },
  getToken: () => token,
};
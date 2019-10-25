export default class Client {
  static URL = 'http://127.0.0.1:5000';

  static getUser = async () => {
    const resp = await fetch(Client.URL + '/me', {
      credentials: 'include',
    });
    if (resp.status === 200) {
      return resp.json();
    }
    throw new Error('Not logged in.');
  }

  static getAuth = async (username, password) => {
    const resp = await fetch(Client.URL + '/login', {
      method: 'POST',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        username: username,
        password: password,
      })
    })
    const json = await resp.json();
    if (resp.status === 200) {
      return json;
    }
    throw new Error(json.message);
  }

  static logOutUser = async () => {
    const resp = await fetch(Client.URL + '/logout', {
      credentials: 'include',
    })
    const json = await resp.json();
    if (resp.status === 200) {
      return json;
    }
    throw new Error(json.message);
  }

  static registerUser = async (username, password1, password2, email) => {
    const resp = await fetch(Client.URL + '/register', {
      method: 'POST',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        'username': username,
        'password1': password1,
        'password2': password2,
        'email': email,
      })
    })
    const json = await resp.json();
    if (resp.status === 201) return json;
    throw new Error(json.message);
  }

  static updateUser = async (args) => {
    const resp = await fetch(Client.URL + '/me', {
      method: 'PUT',
      credentials: 'include',
      headers: new Headers({
          'Content-Type': 'application/json',
      }),
      body: JSON.stringify(args)
    })
    const json = await resp.json();
    if (resp.status === 200) {
      return json;
    }
    throw new Error(json.message);
  }

  static deleteMe = async () => {
    const resp = await fetch(Client.URL + '/me', {
      method: 'DELETE',
      credentials: 'include'
    })
    const json = await resp.json();
    if (resp.status === 200) {
      return json;
    }
    throw new Error(json.message);
  }

  static getUsers = async () => {
    const resp = await fetch(Client.URL + '/users', {
      credentials: 'include'
    })
    const json = await resp.json();
    if (resp.status === 200) {
      return json;
    }
    throw new Error(json.message);
  }

  static deleteUser = async (id) => {
    const resp = await fetch(Client.URL + `/user/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    const json = await resp.json();
    if (resp.status === 200) {
      return json;
    }
    throw new Error(json.message);
  }
}
export default class {
  static URL = process.env.REACT_APP_NAMES_SERVICE || 'http://127.0.0.1:5003';

  static getRandomName = async (id) => {
    const resp = await fetch(this.URL + '/name', {
      credentials: 'include'
    });
    const json = await resp.json();
    if (resp.status === 200) {
      return json;
    }
    throw new Error(json.message);
  }
}

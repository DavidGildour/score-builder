export default class {
  static URL = process.env.REACT_APP_SCORE_SERVICE || 'http://127.0.0.1:5002';

  static getUserScores = async (id) => {
    const resp = await fetch(this.URL + `/scores/${id}`, {
      credentials: 'include'
    });
    const json = await resp.json();
    if (resp.status === 200) {
      return json;
    }
    throw new Error(json.message);
  }
}
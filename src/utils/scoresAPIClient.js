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

  static getLatestScore = async (id) => {
    const resp = await fetch(this.URL + `/scores/${id}/latest`, {
      credentials: 'include'
    });
    const json = await resp.json();
    if (resp.status === 200) {
      return json.content;
    } else if (resp.status === 404) {
      return null;
    }
    throw new Error(json.message);
  }

  static addScore = async (id, score) => {
    const resp = await fetch(this.URL + `/scores/${id}`, {
      method: 'POST',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(score)
    });
    const json = await resp.json();
    if (resp.status === 200) {
      return json;
    }
    throw new Error(json.message);
  }

  static getScore = async (id, scoreName) => {
    const resp = await fetch(this.URL + `/scores/${id}/${scoreName}`, {
      credentials: 'include'
    });
    const json = await resp.json();
    console.log(json);
    if (resp.status === 200) {
      return await json.content;
    }
    return null;
  }

  static updateScore = async (id, scoreName, fields) => {
    const resp = await fetch(this.URL + `/scores/${id}/${scoreName}`, {
      method: "PATCH",
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(fields)
    })
    const json = await resp.json();
    if (resp.status === 200) {
      return json;
    }
    throw new Error(json.message);
  }
}
export const getUser = () => {
    return fetch('http://127.0.0.1:5000/me', {
            credentials: 'include',
        })
        .then(resp => {
            if (resp.status === 200) {
                return resp.json();
            }
            throw Error('Not logged in.');
        })
}

export const getAuth = (username, password) => {
    return fetch('http://127.0.0.1:5000/login', {
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
    .then(resp => {
        if (resp.status === 200) {
            return resp.json();
        } else {
            throw new Error('Invalid credentials!');
        }
    });
}

export const logOutUser = () => {
    return fetch('http://127.0.0.1:5000/logout', {
        credentials: 'include',
    });
}

export const registerUser = (username, password1, password2) => {
    return fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        credentials: 'include',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
            'username': username,
            'password1': password1,
            'password2': password2,
        })
    })
    .then(resp => resp.json());
}

export const updatePassword = (old, pass1, pass2) => {
    return fetch('http://127.0.0.1:5000/me', {
        method: 'PUT',
        credentials: 'include',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
            'old_password': old,
            'password1': pass1,
            'password2': pass2,
        })
    })
    .then(resp => resp.json());
}
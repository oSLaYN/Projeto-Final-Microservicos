document.getElementById('LoginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    await tryLogin();
});

document.getElementById('RegisterForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    await tryRegister();
});

async function tryLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(username, password);
    try {
        const request = await fetch('/api/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const result = await request.json();
        console.log('Result: ', result);
    } catch (error) {
        console.error('Error: ', error);
        alert('Error: ', error);
    }
}

async function tryRegister() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(username, password);
    try {
        const request = await fetch('/api/v1/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const result = await request.json();
        console.log('Result: ', result);
    } catch (error) {
        console.error('Error: ', error);
        alert('Error: ', error);
    }
}
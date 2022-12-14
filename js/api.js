const api = axios.create({
    bseURL: 'http://localhost:3000',
    timeout: 10000,
    headers: { 'Content-Type': 'Application/json' }
});
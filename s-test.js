const express = require('express');

const app = express();

const WSServer = require('express-ws')(app);

app.ws('/', (ws, req) => {
    console.log('Hi, I am WebSocket');
});

app.listen(8080, () => console.log('Server listening pot 8080!'));


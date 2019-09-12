import app from './app';
import * as http from 'http';

const PORT = 3000;

const server = http.createServer(app);
server.listen(PORT);
server.on('listening', ()=>{
    console.info(`Listening ${PORT}`);
});

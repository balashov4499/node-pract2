import app from './app';
import {createConnection} from "typeorm";
import http from 'http';
import "reflect-metadata";

const PORT = 3000;

createConnection().then((conn) => {
    console.log('db connected');
    // await conn.runMigrations();
}).catch(error => console.log(error));

const server = http.createServer(app);
server.listen(PORT);
server.on('listening', () => {
    console.info(`Listening ${PORT}`);
});

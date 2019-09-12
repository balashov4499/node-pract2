import app from './app';
import {createConnection} from "typeorm";
import http from 'http';
import "reflect-metadata";

const PORT = 3000;

createConnection().then(()=>console.log('db connected')).catch(error => console.log(error));

const server = http.createServer(app);
server.listen(PORT);
server.on('listening', ()=>{
    console.info(`Listening ${PORT}`);
});

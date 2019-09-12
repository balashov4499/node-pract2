import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import userRouter from './controllers/users';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(userRouter);

export default app;

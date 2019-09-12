import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './controllers/users';
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'

const app = express();
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(bodyParser.json());
app.use(userRouter);

export default app;

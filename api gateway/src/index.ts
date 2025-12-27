/// <reference path="./types/express.d.ts" />
import express from 'express';
import { serverConfig } from './config/index.js';
import { connectionDB } from './config/db.config.js';
import v1Router from './router/v1Router/index.js';


const app = express();
app.use(express.json())

app.use('/api',v1Router);

app.listen(serverConfig.PORT,async()=>{
    console.log(`server is running on port ${serverConfig.PORT}`)
    await connectionDB();

})
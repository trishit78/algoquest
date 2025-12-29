/// <reference path="./types/express.d.ts" />
import express from 'express';
import { serverConfig } from './config/index.js';
import { connectionDB } from './config/db.config.js';
import v1Router from './router/v1Router/index.js';
import * as proxy from 'http-proxy-middleware'
import { authRequest } from './middleware/auth.middleware.js';
import cors from 'cors';
const app = express();
app.use(cors());

const problemProxyOptions:proxy.Options & {target:string,changeOrigin:boolean}= {
    target:serverConfig.PROBLEM_SERVICE,
    changeOrigin:true,
    pathRewrite:{
        '^/problemservice':'/'
    }
};

const submissionProxyOptions:proxy.Options & {target:string,changeOrigin:boolean}={
    target:serverConfig.SUBMISSION_SERVICE,
    changeOrigin:true,
    pathRewrite:{
        '^/submissionservice':'/'
    }
}


app.use('/problemservice',proxy.createProxyMiddleware(problemProxyOptions))
app.use('/submissionservice',authRequest,proxy.createProxyMiddleware(submissionProxyOptions))



app.use(express.json());
app.use('/api',v1Router);

app.listen(serverConfig.PORT,async()=>{
    console.log(`server is running on port ${serverConfig.PORT}`)
    await connectionDB();

})
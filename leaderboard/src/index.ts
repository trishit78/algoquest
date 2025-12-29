import express from 'express'
import cors from 'cors' 
import { serverConfig } from './config/index.js';
import leaderboardRouter from './router/index.js';



const app = express();



app.use(cors());
app.use(express.json());

app.use('/api/v1',leaderboardRouter)


app.listen(serverConfig.PORT,()=>{
    console.log(`server is running on ${serverConfig.PORT}`)
})
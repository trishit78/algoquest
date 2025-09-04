import express from 'express';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import { startWorkers } from './workers/evaluation.worker';
import { pullALLImages } from './utils/containers/pullImage.util';
//import { runCode } from './utils/containers/codeRunner';
//import { CPP_IMAGE } from './utils/constants';
const app = express();

app.use(express.json());

/**
 * Registering all the routers and their corresponding routes with out app server object.
 */

app.use(attachCorrelationIdMiddleware);
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router); 


/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);


app.listen(serverConfig.PORT,async () => {
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
    logger.info(`Press Ctrl+C to stop the server.`);
    await startWorkers();
    logger.info("Workers started successfully");


     await pullALLImages();
    console.log('image pulled successfully')
   //await testCppCode();
});


// async function testPyCode() {
//     const pythonCode = `
// import time
// i=0
// while True:
//     i+=1
//     print(i)
//     time.sleep(1)

// Bye("Bye")
//     `;      

//     await runCode({
//         code:pythonCode,
//         language:"python",
//         timeout:3000
//     })
// }

// async function testCppCode() {
//     const cppCode = `
//     #include <iostream>
//     int main() {
//     int n;
//     std::cin>>n;
       
//         std::cout<<n*n;
        
//         return 0;
//     }
//     `;

//     await runCode({
//         code:cppCode,
//         language:"cpp",
//         timeout:5000,
//         imageName:CPP_IMAGE,
//         input:"5"
//     })
// }
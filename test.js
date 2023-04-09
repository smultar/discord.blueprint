import { Client } from './index.js';
import 'dotenv/config.js'; 

Client({
        id: process.env.CLIENT_ID,
        token: process.env.TOKEN,
    }, 
    './events', 
    './commands'
);
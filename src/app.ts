import express from 'express';
import cors from 'cors';
import { customLog } from './utils/logging.utils';

const app = express();
app.use(cors());

app.get('/api', (req, res) => {
    res.json({
        serverResponse: true,
        data: 'Api Response!'
    })
})

app.get('/', (req, res) => {
    res.json({
        serverResponse: true,
        data: 'Hello!'
    })
});

app.listen( process.env.PORT || 4100, () => {
    customLog(` ==> Server started on port 4100`);
})
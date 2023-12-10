import swaggerDocs from './utils/swagger'
import { config } from 'dotenv';
const app = require('./app.ts');

config();

const { PORT = 9090, DATABASE_URL, DEBUG } = process.env;

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`)
    swaggerDocs(app, PORT as number);
});

export { PORT }
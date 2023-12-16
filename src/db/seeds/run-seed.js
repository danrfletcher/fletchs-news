const data = require('../data/development-data/index.js');
const seed = require('./seed.js');
const db = require('../connection.js')

const runSeed = async () => {
    try {
        await seed(data)
        console.log("Database seeding successful. Closing connection...")
    } catch (err) {
        console.log(err)
    }
}

runSeed();
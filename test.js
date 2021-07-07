require('dotenv').config();

const knex = require('knex')({
    client: process.env.DB_DRIVER,
    connection: {
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME + "22"
    }
});
console.log("EEEEEEEEEEEEEEEEEEEEEEE");

(async () => {
    try {
        console.log(await knex.select().table('Users'));
    }catch(e) {
        console.log("ERROR");
    }
})();
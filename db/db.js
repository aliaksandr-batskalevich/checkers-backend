const pg = require('pg');
const {Pool} = pg;

const pool = new Pool({
    user: 'postgres',
    // password: 'Marry1990',   // for server in localhost
    password: 'postgres',       // for server in GCP
    host: 'localhost',
    port: 5432,
    database: 'checkers_database'
});


module.exports = pool;
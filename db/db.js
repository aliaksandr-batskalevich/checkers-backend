const pg = require('pg');
const {Pool} = pg;

const pool = new Pool({
    // user: 'alex',           // for server in GCP
    // password: 'alex',       // for server in GCP

    user: 'postgres',        // for server in localhost
    password: 'Marry1990',   // for server in localhost

    host: 'localhost',
    port: 5432,
    database: 'checkers_database'
});


module.exports = pool;
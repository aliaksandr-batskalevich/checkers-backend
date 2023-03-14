import pg from 'pg';
const {Pool} = pg;

const pool = new Pool({
    user: 'postgres',
    password: 'Marry1990',
    host: 'localhost',
    port: 5432,
    database: 'checkers_database'
});


export default pool;
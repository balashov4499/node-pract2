import * as mysql from 'mysql2';

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "nodepract",
    password: "1234"
});

export default pool;

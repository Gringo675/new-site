import mysql2 from 'mysql2/promise'

const pool = mysql2.createPool({
    host: process.env.DB_HOST_LOCAL,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default async function request(query) {

    const [rows] = await pool.execute(query);

    return rows
};


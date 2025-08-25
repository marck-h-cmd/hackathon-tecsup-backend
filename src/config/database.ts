
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const connectDB = async (): Promise<void> => {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL Connected:', connection.config.host);
        connection.release();
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
        process.exit(1);
    }
};

export { connectDB, pool };
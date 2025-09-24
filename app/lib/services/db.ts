import mysql from 'mysql2/promise';
import {parse } from 'url';

let pool : mysql.Pool | null = null;

export async function getDbConnection() : Promise<mysql.PoolConnection> {
    if (!pool) {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            throw new Error('DATABASE_URL is not defined in environment variables');
        }
        const parseUrl = parse(databaseUrl, true);
        const [user, password] = parseUrl.auth ? parseUrl.auth.split(':') : [null, null];
        pool = mysql.createPool({
            host: parseUrl.hostname || 'localhost',
            user : user || 'root',
            password : password || '',
            database : parseUrl.pathname?.slice(1) || 'uts_pbd',
            port : parseUrl.port ? parseInt(parseUrl.port) : 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        })
    }
    return pool.getConnection();
}
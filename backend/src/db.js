import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

const parseSslConfig = () => {
  if (process.env.DB_SSL !== 'true') {
    return undefined;
  }

  const caValue = process.env.DB_CA;
  if (!caValue) {
    return { ssl: { rejectUnauthorized: true } };
  }

  let ca = caValue;
  if (fs.existsSync(caValue)) {
    ca = fs.readFileSync(path.resolve(caValue));
  } else {
    try {
      ca = Buffer.from(caValue, 'base64');
    } catch (error) {
      ca = caValue;
    }
  }

  return { ssl: { ca, rejectUnauthorized: true } };
};

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...parseSslConfig()
});

export const query = (sql, params = []) => pool.execute(sql, params);

export default pool;

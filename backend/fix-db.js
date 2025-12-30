const { Client } = require('pg');
require('dotenv').config();

async function migrate() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });

    try {
        await client.connect();
        console.log('Connecting to database...');
        await client.query('ALTER TABLE x_ray ADD COLUMN IF NOT EXISTS "originalName" CHARACTER VARYING;');
        console.log('Successfully added "originalName" column to x_ray table.');
    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        await client.end();
    }
}

migrate();

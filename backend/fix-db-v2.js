const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Manually parse .env to be sure
const envPath = path.resolve(__dirname, '.env');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = {};
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

async function migrate() {
    const client = new Client({
        host: env.DB_HOST,
        port: parseInt(env.DB_PORT),
        user: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE,
    });

    try {
        console.log(`Connecting to ${env.DB_DATABASE} on ${env.DB_HOST}...`);
        await client.connect();
        console.log('Connected.');

        const res = await client.query('ALTER TABLE x_ray ADD COLUMN IF NOT EXISTS "originalName" CHARACTER VARYING;');
        console.log('SQL Executed:', res.command);

        // Check if it exists now
        const checkRes = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name='x_ray' AND column_name='originalName';");
        if (checkRes.rows.length > 0) {
            console.log('SUCCESS: "originalName" column verified in x_ray table.');
        } else {
            console.error('FAILURE: Column still does not exist.');
        }

    } catch (err) {
        console.error('CRITICAL ERROR:', err.message);
    } finally {
        await client.end();
    }
}

migrate();

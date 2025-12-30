
const axios = require('axios');
const fs = require('fs');
const https = require('https');
const path = require('path');

// Manually verify the token - hardcoding the one from the file for the test to ensure no Env reading issues
// But also checking what the env would be.
require('dotenv').config();

async function testHF() {
    console.log('--- STARTING HF CONNECTIVITY TEST ---');

    // 1. Check Token
    const envToken = process.env.HF_API_TOKEN;
    console.log(`Token from process.env: '${envToken}' (Length: ${envToken ? envToken.length : 0})`);

    // Explicitly trim just in case logic fails
    const cleanToken = envToken ? envToken.trim() : '';

    if (!cleanToken.startsWith('hf_')) {
        console.warn('WARNING: Token does not start with "hf_", it might be invalid.');
    }

    const modelUrl = 'https://router.huggingface.co/hf-inference/models/keremberke/chest-xray-classification';

    // 2. Prepare HTTPS Agent (IPv4)
    const httpsAgent = new https.Agent({ family: 4 });
    console.log('Using HTTPS Agent with IPv4 enforcement.');

    try {
        // 3. Create a dummy image buffer (1x1 PNG or similar would be best, but random bytes might pass "is image" check enough to hit model)
        // Better: Try to find a file in ./uploads
        const uploadsDir = path.join(__dirname, 'uploads');
        let imageBuffer;

        if (fs.existsSync(uploadsDir)) {
            const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
            if (files.length > 0) {
                const filePath = path.join(uploadsDir, files[0]);
                console.log(`Using real file for test: ${filePath}`);
                imageBuffer = fs.readFileSync(filePath);
            }
        }

        if (!imageBuffer) {
            console.log('No existing file found in ./uploads, creating dummy buffer (might fail with "corrupt image" but proves auth).');
            // Minimal PNG signature
            imageBuffer = Buffer.from('89504E470D0A1A0A0000000D4948445200000001000000010100000000376EF9240000000A49444154789C6360000000020001737501180000000049454E44AE426082', 'hex');
        }

        console.log('Sending request to Hugging Face API...');
        const response = await axios.post(
            modelUrl,
            imageBuffer,
            {
                headers: {
                    Authorization: `Bearer ${cleanToken}`,
                    'Content-Type': 'application/octet-stream',
                },
                httpsAgent: httpsAgent,
                timeout: 30000,
            },
        );

        console.log('✅ SUCCESS! API Responded.');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.log('❌ FAILURE.');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Headers:', JSON.stringify(error.response.headers, null, 2));
            console.log('Data (Error Details):', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Network/System Error:', error.message);
            console.error('Code:', error.code);
        }
    }
}

testHF();

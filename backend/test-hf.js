
const axios = require('axios');
const fs = require('fs');

async function testHF() {
    const token = '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';
    const modelUrl = 'https://api-inference.huggingface.co/models/dima806/chest_xray_pneumonia_detection';

    // Create a dummy small image buffer (1x1 transparent png) just to test connection/auth
    // or use a real file if available. I'll use a mocked buffer for structure test.
    // actually HF might complain about bad image.
    // Let's try to fetch model info or just send a tiny buffer.

    console.log('Testing HF API Connection...');
    try {
        // Just checking model availability first via simple GET if supported, 
        // or POSTing a small buffer.

        // We'll try to find a file in uploads if possible, else create a dummy one.
        // But for now, we can just check if we get a 401 or 503 or 200.

        // Mocking a file upload with random bytes might trigger model error but proves auth works.
        const header = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(modelUrl, { headers: header });
        console.log('Model Info/Page Response Status:', response.status);
        // Note: Inference API usually implies POST. GET might just return model info or 405.

        console.log('API Token seems valid (or at least public access is allowed).');

    } catch (error) {
        if (error.response) {
            console.error('API Error Status:', error.response.status);
            console.error('API Error Data:', error.response.data);
        } else {
            console.error('Network/Other Error:', error.message);
        }
    }
}

testHF();

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function test() {
    try {
        const apiContent = fs.readFileSync(path.join(__dirname, 'api.txt'), 'utf8');
        const groqMatch = apiContent.match(/groq\s+api\s*:\s*(.+)/i);
        const groqKey = groqMatch[1].trim();

        const tmpAudio = path.join(__dirname, 'sample.ogg');
        if (!fs.existsSync(tmpAudio)) {
            console.log("sample.ogg missing");
            return;
        }
        
        const form = new FormData();
        form.append('file', fs.createReadStream(tmpAudio), { filename: 'audio.ogg', contentType: 'audio/ogg' });
        form.append('model', 'whisper-large-v3-turbo');

        const headers = Object.assign({}, form.getHeaders(), { 'Authorization': 'Bearer ' + groqKey });
        
        await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', form, { headers });
        console.log("Success with OGG on Groq!");
    } catch(e) {
        console.log("Error:", e.response?.data || e.message);
    }
}
test();

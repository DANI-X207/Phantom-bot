const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

async function test() {
    try {
        const apiContent = fs.readFileSync(path.join(__dirname, 'api.txt'), 'utf8');
        const groqMatch = apiContent.match(/groq\s+api\s*:\s*(.+)/i);
        const groqKey = groqMatch[1].trim();

        const tmpAudio = path.join(__dirname, 'sample.ogg');
        const tmpAudioMp3 = path.join(__dirname, 'sample.mp3');
        
        let fileToSend = tmpAudio;
        let fileExt = 'ogg';
        let mimeType = 'audio/ogg';

        try {
            await new Promise((resolve, reject) => {
                ffmpeg(tmpAudio)
                    .outputOptions('-b:a', '128k')
                    .output(tmpAudioMp3)
                    .on('end', resolve)
                    .on('error', reject)
                    .run();
            });
            fileToSend = tmpAudioMp3;
            fileExt = 'mp3';
            mimeType = 'audio/mpeg';
            console.log('Converted to MP3!');
        } catch (e) {
            console.log('[STT] FFmpeg not available or failed:', e.message);
        }

        const form = new FormData();
        form.append('file', fs.createReadStream(fileToSend), { filename: 'audio.' + fileExt, contentType: mimeType });
        form.append('model', 'whisper-large-v3-turbo');

        const headers = Object.assign({}, form.getHeaders(), { 'Authorization': 'Bearer ' + groqKey });
        
        await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', form, { headers });
        console.log("Success on Groq!");
    } catch(e) {
        console.log("Error:", e.response?.data || e.message);
    }
}
test();

const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, 'test.ogg');
fs.writeFileSync(input, Buffer.from([0,0,0,0])); // fake

const output = path.join(__dirname, 'test.mp3');

ffmpeg(input)
    .output(output)
    .on('end', () => console.log('Converted to MP3!'))
    .on('error', (err) => console.log('FFmpeg error:', err.message))
    .run();

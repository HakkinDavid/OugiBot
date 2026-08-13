const fs = require('fs');
const axios = require('axios');

module.exports = function ({ text, file, lang }) {
  return new Promise((resolve, reject) => {
    const ttsURL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;

    axios.get(ttsURL, {
      responseType: 'stream',
      headers: {
        'Referer': 'https://translate.google.com/',
        'User-Agent': 'stagefright/1.2 (Linux;Android 5.0)'
      }
    }).then(response => {
      const stream = response.data.pipe(fs.createWriteStream(file));
      stream.on('finish', resolve);
      stream.on('error', reject);
    }).catch(reject);
  });
};

// Inspired in https://github.com/CheeseDanish1/tts-simple

const fs = require('fs');
const request = require('request');

module.exports = function ({ text, file, lang }) {
  return new Promise((resolve, reject) => {
    const ttsURL = {
      url: `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`,
      headers: {
        'Referer': 'http://translate.google.com/',
        'User-Agent': 'stagefright/1.2 (Linux;Android 5.0)'
      }
    };

    const stream = request(ttsURL)
      .on('error', reject)
      .pipe(fs.createWriteStream(file));

    stream.on('finish', resolve);
    stream.on('error', reject);
  });
};

// Inspired in https://github.com/CheeseDanish1/tts-simple

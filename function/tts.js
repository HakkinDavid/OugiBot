module.exports =
function ({text, file, lang}) {
  let ttsURL = {
    url: `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`,
    headers: {
      'Referer': 'http://translate.google.com/',
      'User-Agent': 'stagefright/1.2 (Linux;Android 5.0)'
    }
  }
  request(ttsURL).pipe(fs.createWriteStream(file));
}

// Inspired in https://github.com/CheeseDanish1/tts-simple

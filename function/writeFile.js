const CryptoJS = require('crypto-js');

module.exports =

async function (path, content, callback = console.error) {
    await fs.writeFile(path, CryptoJS.AES.encrypt(content, process.env.CRYPT_KEY).toString(), 'utf-8', callback);
}
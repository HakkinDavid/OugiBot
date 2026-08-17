const CryptoJS = require('crypto-js');
const fs = require('fs');

module.exports = async function (filePath, content, callback = console.error) {
    try {
        const encrypted = process.env.CRYPT_KEY 
            ? CryptoJS.AES.encrypt(content, process.env.CRYPT_KEY).toString()
            : content;
        await fs.promises.writeFile(filePath, encrypted, 'utf-8');
    } catch (err) {
        if (typeof callback === 'function') {
            callback(err);
        } else {
            console.error(err);
        }
    }
};
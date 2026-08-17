const CryptoJS = require('crypto-js');
const fs = require('fs');

module.exports = function (filePath, encoding = 'utf-8', callback = console.error) {
    try {
        if (!fs.existsSync(filePath)) return undefined;
        let raw = fs.readFileSync(filePath, encoding);
        if (raw === undefined || raw === null || raw.length === 0) {
            return '{}';
        }
        try {
            return JSON.parse(raw);
        } catch {
            // Not raw JSON, try decrypting
        }
        if (!process.env.CRYPT_KEY) return undefined;
        const decryptedStr = CryptoJS.AES.decrypt(raw, process.env.CRYPT_KEY).toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedStr);
    } catch (err) {
        if (typeof callback === 'function') callback(err);
        return undefined;
    }
};
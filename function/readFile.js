module.exports =

function (path, encoding = 'utf-8', callback = console.error) {
    let raw = fs.readFileSync(path, encoding, callback);
    try {
        JSON.parse(raw);
        return raw;
    }
    catch {
        if (raw === undefined || raw === null) {
            return '{}';
        }
    }
    let decrypted = CryptoJS.AES.decrypt(raw, process.env.CRYPT_KEY).toString(CryptoJS.enc.Utf8);
    try {
        return JSON.parse(decrypted);
    }
    catch (e) {
        console.error(e);
        console.error("The file at " + path + " is bad!");
        return undefined;
    }
}
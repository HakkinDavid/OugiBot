const path = require('path');
const dbManager = require('./db')();

module.exports = function () {
    return dbManager.ensureLoadedAndValid();
};

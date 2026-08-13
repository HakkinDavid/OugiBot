const path = require('path');

module.exports = function () {
    return ougi.db().ensureLoadedAndValid();
};

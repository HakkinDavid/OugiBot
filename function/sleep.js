module.exports = function (milliseconds) {
  return new Promise(resolve => setTimeout(resolve, Math.max(0, milliseconds || 0)));
};

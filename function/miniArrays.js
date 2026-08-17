module.exports = function (mainArray, size) {
  if (!Array.isArray(mainArray) || !size || size <= 0) return [];
  const chunked = [];
  for (let i = 0; i < mainArray.length; i += size) {
    chunked.push(mainArray.slice(i, i + size));
  }
  return chunked;
};

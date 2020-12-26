module.exports =

async function (mainArray, size) {
  var chunked = [];

  while (mainArray.length) {
    chunked.push(mainArray.splice(0, size));
  }

  return chunked;
}

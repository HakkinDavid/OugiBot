module.exports =

function (mainArray, size) {
  let chunked = [];

  while (mainArray.length) {
    chunked.push(mainArray.splice(0, size));
  }

  return chunked;
}

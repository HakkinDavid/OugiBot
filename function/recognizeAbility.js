module.exports =

function (imageURL) {
  var recognized = new ImageRecognition(imageURL, (res) => {return res});
  return recognized;
}

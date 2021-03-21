module.exports =

function (arguments, msg) {
  if (arguments.includes("stats") || arguments.includes("statistics")) {
    arguments = arguments.slice(1);
    ougi.covidstats(arguments, msg)
  }
  else {
    ougi.covidNEWS(msg)
  }
}

module.exports =

function (dateOBJ) {
  let aged = new Date().getTime() - dateOBJ.getTime();
  let age = {};
      age.s = aged / 1000; //inspired on 4castle's answer at stackoverflow, which was quite imprecise but it gave me insight
      age.min = aged / 60000;
      age.h = aged / 3600000;
      age.d = aged / 86400000;
      age.m = aged / 2628000000;
      age.y = aged / 31535965440.0381851;

      age.s %= 60;
      age.min %= 60;
      age.h %= 24;
      age.d %= 30.4166666667;
      age.m %= 12;

  let poorlyAged = "";
  let timeStyilish = ["year", "month", "day", "hour", "minute", "second"];
  let timeValues = [];

  for (let element in age) {
    age[element] = Math.floor(age[element]);
    timeValues.unshift(age[element]);
  }

  for (i=0; timeValues.length > i; i++) {
    if (timeValues[i] > 0) {
      poorlyAged += timeValues[i] + " " + timeStyilish[i];
      if (timeValues[i] != 1) {
        poorlyAged += "s";
      }
    }
    if (i != timeValues.length-1 && !poorlyAged.endsWith(" ") && poorlyAged.length > 0) {
        poorlyAged += ", "
    }
  }
  return poorlyAged;
}

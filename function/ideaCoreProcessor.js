module.exports =

async function (input) {
  let neuroNetworks = './neuroNetworks.txt';
  let idea = removeWords(input);
  let identifier = idea[0];
  let mind = JSON.parse(fs.readFileSync(neuroNetworks, 'utf-8', console.error));

  if (!mind.hasOwnProperty(identifier)) {
    mind[identifier] = [];
  }

  let arrayMaker = mind[identifier];
  let num = arrayMaker.length;
  arrayMaker[num] = [];

  for (j=0; idea.length > j; j++) {
    arrayMaker[num].push(idea[j]);
    mind[identifier] = arrayMaker;
  }

  let proArray = JSON.stringify(mind);
  fs.writeFileSync(neuroNetworks, proArray, console.error);
  ougi.backup(neuroNetworks, neuroChannel);
}

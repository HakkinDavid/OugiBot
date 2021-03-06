module.exports =

async function (input) {
  let idea = removeWords(input);
  let identifier = idea[0];

  if (!mindOBJ.hasOwnProperty(identifier)) {
    mindOBJ[identifier] = [];
  }

  let arrayMaker = mindOBJ[identifier];
  let num = arrayMaker.length;
  arrayMaker[num] = [];

  for (j=0; idea.length > j; j++) {
    arrayMaker[num].push(idea[j]);
    mindOBJ[identifier] = arrayMaker;
  }

  await fs.writeFile('./neuroNetworks.txt', JSON.stringify(mindOBJ), console.error);
  ougi.backup('./neuroNetworks.txt', neuroChannel);
}

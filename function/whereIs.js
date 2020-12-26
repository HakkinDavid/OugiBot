module.exports =

async function (my, superSuit) {
  return Object.keys(my).find(k => my[k] === superSuit);
}

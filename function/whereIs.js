module.exports =

function whereIs(my, superSuit) {
  return Object.keys(my).find(k => my[k] === superSuit);
}

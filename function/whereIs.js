module.exports =

function whereIs(my, superSuit) {
  Object.keys(my).find(k => my[k] === superSuit);
}

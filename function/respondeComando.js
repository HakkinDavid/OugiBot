module.exports =

async function (arguments, msg) {
    var options = ["Sí", "No", "Simón", "Nah", "Tal vez", "Tal vez no", "Supongo", "Supongo que no", "No lo sé, por lo que no te puedo responder.", "No lo sé, tú dime.", "Pregúntale a alguien más.", "Negativo", "Negativo multiplicado por negativo.", "Panqueques", "**Imposible**", "No lo sé, el que sabe eres tú.", "¿Quieres que responda eso?", "Uhhh"]
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
}

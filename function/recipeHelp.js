module.exports =

async function (msg) {
    let embed = await ougi.helpPreset(msg, "recipe");
    embed.setDescription(await ougi.text(msg, "recipeHelpDesc"))
    .addField(await ougi.text(msg, "example"), "`ougi recipe pancakes`");

    msg.channel.send({embed}).catch(console.error);
}
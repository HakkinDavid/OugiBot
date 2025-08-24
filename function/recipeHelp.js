module.exports =

async function (msg) {
    let embed = await ougi.helpPreset(msg, "recipe");
    embed.setDescription(await ougi.text(msg, "recipeHelpDesc"))
    .addFields({name: await ougi.text(msg, "example"), value: "`ougi recipe pancakes`"});

    msg.channel.send({embeds: [embed]}).catch(console.error);
}
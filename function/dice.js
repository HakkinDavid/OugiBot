const { EmbedBuilder } = require('discord.js');

module.exports = async function diceCommand(msg) {
  try {
    const num = Math.floor(Math.random() * 6) + 1;

    const embed = new EmbedBuilder()
      .setTitle((await ougi.text(msg, 'diceTitle')).replace(/{num}/gi, num))
      .setColor('#E32C22')
      .setImage(`https://github.com/HakkinDavid/OugiBot/blob/master/images/dice/${num}.png?raw=true`);

    // Envía el gif de lanzamiento de dado
    const rollingMsg = await msg.channel.send(await ougi.text(msg, 'diceRolling'));

    setTimeout(async () => {
      try {
        await rollingMsg.delete();
        await msg.channel.send({ embeds: [embed] });
      } catch (err) {
        console.error('Error enviando el resultado del dado:', err);
        await msg.channel.send(await ougi.text(msg, 'diceErrorSend'));
      }
    }, num * 200);

  } catch (err) {
    console.error('Error ejecutando el comando de dado:', err);
    await msg.channel.send(await ougi.text(msg, 'diceErrorGeneral'));
  }
};
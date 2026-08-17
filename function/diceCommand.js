const { EmbedBuilder } = require('discord.js');
const crypto = require('crypto');

module.exports = async function (msg) {
  try {
    const num = crypto.randomInt(1, 7);

    const embed = new EmbedBuilder()
      .setTitle(await ougi.text({ msg, stringID: 'diceTitle', values: { num } }))
      .setColor('#E32C22')
      .setImage(`https://github.com/HakkinDavid/OugiBot/blob/master/images/dice/${num}.png?raw=true`);

    const rollingMsg = await msg.channel.send(await ougi.text({ msg, stringID: 'diceRolling' }));

    setTimeout(async () => {
      try {
        await rollingMsg.delete().catch(() => {});
        await msg.channel.send({ embeds: [embed] });
      } catch (err) {
        console.error('Error sending dice result:', err);
        await msg.channel.send(await ougi.text({ msg, stringID: 'diceErrorSend' }).catch(() => "Failed to send dice result.")).catch(() => {});
      }
    }, num * 200);

  } catch (err) {
    console.error('Error executing dice command:', err);
    await msg.channel.send(await ougi.text({ msg, stringID: 'diceErrorGeneral' }).catch(() => "Failed to roll dice.")).catch(() => {});
  }
};
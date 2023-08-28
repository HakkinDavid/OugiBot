module.exports =

async function (msg) {
  let num = (Math.floor(Math.random()*6)) + 1;
  let embed = new Discord.EmbedBuilder()
  .setTitle((await ougi.text(msg, 'diceTitle')).replace(/{num}/gi, num))
  .setColor('#E32C22')
  .setImage('https://github.com/HakkinDavid/OugiBot/blob/master/images/dice/' + num + '.png?raw=true');
  msg.channel.send('<a:dice:861920688894246922>').then(
    (msg) => {
      setTimeout(() => {
        msg.delete();
        msg.channel.send({embeds: [embed]});
      }, num*1000*0.2)
    }
  );
}

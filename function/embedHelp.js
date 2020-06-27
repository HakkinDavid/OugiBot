module.exports =

function embedHelp(msg) {
  msg.channel.send('Do you want to make some cool embeds? Try something like\n> ougi embed youtube.com/watch?v=dQw4w9WgXcQ `A nice idea for a marriage proposal` Check it out.', {embed: {
  color: 2294599,
  author: {
    name: msg.author.username,
    icon_url: msg.author.avatarURL
  },
  title: 'A nice idea for a marriage proposal',
  url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
  description: 'Check it out.',
  timestamp: new Date(),
  footer: {
    icon_url: client.user.avatarURL,
    text: "AstleyEmbed by Ougi"
  }
  }
}).then().catch(console.error);
}

module.exports =

function embedHelp(msg) {
  var embed = new Discord.RichEmbed()
  .setTitle("Ougi's `embed` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL)
  .setColor("#230347")
  .setDescription("Use this command to create your very own custom embed. Just include, after `ougi embed`, any of the following command options with their respective content. Keep in mind, **all of these command options are command optional** and there's no specific order.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("::author", "An embed's author name, which appears in the top. It can be plain text or an user mention.\n__Examples:__\n`::author Rick Astley`\n`::author `" + msg.author.toString() + "` `")
  .addField("::authorurl", "An URL to mask within an embed's author name, so it'll work like a link when an user clicks over it.\n__Example:__\n`::authorurl https://twitter.com/RickAstley`")
  .addField("::avatar", "Image to use as author avatar.\n__Examples:__\n`::avatar `" + msg.author.toString() + "` `\n`::avatar https://www.kissfm.es/wp-content/uploads/2020/02/rickastley.jpg`\n`::avatar file 2`\n`::avatar guild`\n`::avatar myself`\n`::avatar ougi`")
  .addField("::title", "Text to use as an embed's title.\n__Example:__\n`::title Such a good song`")
  .addField("::url", "An URL to mask within an embed's title, so it'll work like a link when an user clicks over it.\n__Example:__\n`::url https://www.youtube.com/watch?v=dQw4w9WgXcQ`")
  .addField("::description", "Text for the description of an embed.\n__Example:__\n`::description You wouldn't get this from any other guy.`")
  .addField("::subtitle", "Text to use as subtitle for an embed, also known as a field's title. You can add up to 25 subtitles. The order for these depends in which order you add them.\n__Example:__\n`::subtitle Take me to your heart. ::subtitle Oh, your love...`")
  .addField("::field", "Text to use as field for an embed, below each subtitle. You can add up to 25 fields. The order for these depends in which order you add them.\n__Example:__\n`::field Never let me go ::field It's all I need to know.`")
  .addField("::color", "Color for an embed. It can be an hexadecimal value, RGB value or a supported color name.\n__Examples:__\n`::color #e60d80`\n`::color 230, 13, 128`\n`::color blue`")
  .addField("::thumbnail", "Image to use as thumbnail.\n__Examples:__\n`::thumbnail `" + msg.author.toString() + "` `\n`::thumbnail https://www.kissfm.es/wp-content/uploads/2020/02/rickastley.jpg`\n`::thumbnail file 1`\n`::thumbnail guild`\n`::thumbnail myself`\n`::thumbnail ougi`")
  .addField("::image", "Image to display widely across an embed.\n__Examples:__\n`::image `" + msg.author.toString() + "` `\n`::image https://www.kissfm.es/wp-content/uploads/2020/02/rickastley.jpg`\n`::image file 4`\n`::image guild`\n`::image myself`\n`::image ougi`")
  .addField("::footer", "Text for the bottom of an embed.\n__Example:__\n`::footer I got angels on my side, can you see 'em?`")
  .addField("::icon", "Small icon to include in the bottom left corner.\n__Examples:__\n`::icon `" + msg.author.toString() + "` `\n`::icon https://www.kissfm.es/wp-content/uploads/2020/02/rickastley.jpg`\n`::icon file 3`\n`::icon guild`\n`::icon myself`\n`::icon ougi`")
  .addField("::timestamp", "If included, a timestamp will be added to the footer.\n__Example:__\n`::timestamp`")
  .addField("How to use command options that require images", "After the command option, specify an image. It can be an user mention (to use their avatar), an image URL, an attached image (see the section `How to use attached images` below for more information), `guild`\n`myself` or `ougi`.")
  .addField("How to use attached images", "If you attach any images to your message when executing this command, you can use them with any command option that requires images, just add `file` and command optionally, if you attach more than one image, the index (position of attachment, default is first).\n__Examples:__\n`::avatar file`\n`::thumbnail file 2`\n`::image file 3`\n`::icon file 4`")
  .addField("\u200b", "\u200b")
  .addField("Example of everything above", "*Don't worry, if this is too complex for your needs, remember you can leave some command options out.*")
  .setImage("https://github.com/HakkinDavid/OugiBot/blob/master/images/embed%20example.png?raw=true");

  msg.channel.send({embed}).catch(console.error);
}

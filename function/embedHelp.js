module.exports =

async function (arguments, msg) {
  var embed = new Discord.MessageEmbed()
  .setTitle("Ougi's `embed` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")

  if (arguments[1] != undefined) {
    embed.setDescription("Previewing information about the `::" + arguments[1].replace("::", "") + "` option. Remember these command options should be written after `ougi embed` in order to use them.")
  }

  if (arguments.join(" ").replace("::", "") == "embed author") {
    embed.addField("::author", "An embed's author name, which appears in the top. It can be plain text or an user mention.\n__" + await ougi.text(msg, "example") + "__\n`::author Rick Astley`\n`::author `" + msg.author.toString() + "` `")
  }

  else if (arguments.join(" ").replace("::", "") == "embed authorurl") {
    embed.addField("::authorurl", "An URL to mask within an embed's author name, so it'll work like a link when an user clicks over it.\n__" + await ougi.text(msg, "example") + "__\n`::authorurl https://twitter.com/RickAstley`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed avatar") {
    embed.addField("::avatar", "Image to use as author avatar.\n__" + await ougi.text(msg, "example") + "__\n`::avatar https://www.kissfm.es/wp-content/uploads/2020/02/rickastley.jpg`\n`::avatar file 2`\n`::avatar guild`\n`::avatar myself`\n`::avatar ougi`\n`::avatar `" + msg.author.toString() + "` `")
    .addField("How to use command options that require images", "After the command option, specify an image. It can be an user mention (to use their avatar), an image URL, an attached image, `guild`, `myself` (to use your avatar) or `ougi`.")
    .addField("How to use attached images", "If you attach any images to your message when executing this command, you can use them with any command option that requires images, just add `file` and optionally, if you attach more than one image, the index (position of attachment, default is first).\n__" + await ougi.text(msg, "example") + "__\n`::avatar file`\n`::avatar file 2`\n`::avatar file 3`\n`::avatar file 4`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed title") {
    embed.addField("::title", "Text to use as an embed's title.\n__" + await ougi.text(msg, "example") + "__\n`::title Such a good song`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed url") {
    embed.addField("::url", "An URL to mask within an embed's title, so it'll work like a link when an user clicks over it.\n__" + await ougi.text(msg, "example") + "__\n`::url https://www.youtube.com/watch?v=dQw4w9WgXcQ`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed description" || arguments.join(" ").replace("::", "") == "embed desc") {
    embed.addField("::description", "Text for the description of an embed. This command option can also be used as `::desc`.\n__" + await ougi.text(msg, "example") + "__\n`::description You wouldn't get this from any other guy.`\n`::desc Don't tell me you're too blind to see.`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed subtitle") {
    embed.addField("::subtitle", "Text to use as subtitle for an embed, also known as a field's title. You can add up to 25 subtitles. The order for these depends in which order you add them.\n__" + await ougi.text(msg, "example") + "__\n`::subtitle Take me to your heart. ::subtitle Oh, your love...`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed field") {
    embed.addField("::field", "Text to use as field for an embed, below each subtitle. You can add up to 25 fields. The order for these depends in which order you add them.\n__" + await ougi.text(msg, "example") + "__\n`::field Never let me go ::field It's all I need to know.`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed color") {
    embed.addField("::color", "Color for an embed. It can be an hexadecimal value, RGB value or a supported color name.\n__" + await ougi.text(msg, "example") + "__\n`::color #e60d80`\n`::color 230, 13, 128`\n`::color blue`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed thumbnail") {
    embed.addField("::thumbnail", "Image to use as thumbnail.\n__" + await ougi.text(msg, "example") + "__\n`::thumbnail https://www.kissfm.es/wp-content/uploads/2020/02/rickastley.jpg`\n`::thumbnail file 1`\n`::thumbnail guild`\n`::thumbnail myself`\n`::thumbnail ougi`\n`::thumbnail `" + msg.author.toString() + "` `")
    .addField("How to use command options that require images", "After the command option, specify an image. It can be an user mention (to use their avatar), an image URL, an attached image, `guild`, `myself` (to use your avatar) or `ougi`.")
    .addField("How to use attached images", "If you attach any images to your message when executing this command, you can use them with any command option that requires images, just add `file` and optionally, if you attach more than one image, the index (position of attachment, default is first).\n__" + await ougi.text(msg, "example") + "__\n`::thumbnail file`\n`::thumbnail file 2`\n`::thumbnail file 3`\n`::thumbnail file 4`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed image") {
    embed.addField("::image", "Image to display widely across an embed.\n__" + await ougi.text(msg, "example") + "__\n`::image https://www.kissfm.es/wp-content/uploads/2020/02/rickastley.jpg`\n`::image file 4`\n`::image guild`\n`::image myself`\n`::image ougi`\n`::image `" + msg.author.toString() + "` `")
    .addField("How to use command options that require images", "After the command option, specify an image. It can be an user mention (to use their avatar), an image URL, an attached image, `guild`, `myself` (to use your avatar) or `ougi`.")
    .addField("How to use attached images", "If you attach any images to your message when executing this command, you can use them with any command option that requires images, just add `file` and optionally, if you attach more than one image, the index (position of attachment, default is first).\n__" + await ougi.text(msg, "example") + "__\n`::image file`\n`::image file 2`\n`::image file 3`\n`::image file 4`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed footer") {
    embed.addField("::footer", "Text for the bottom of an embed.\n__" + await ougi.text(msg, "example") + "__\n`::footer I got angels on my side, can you see 'em?`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed icon") {
    embed.addField("::icon", "Small icon to include in the bottom left corner.\n__" + await ougi.text(msg, "example") + "__\n`::icon https://www.kissfm.es/wp-content/uploads/2020/02/rickastley.jpg`\n`::icon file 3`\n`::icon guild`\n`::icon myself`\n`::icon ougi`\n`::icon `" + msg.author.toString() + "` `")
    .addField("How to use command options that require images", "After the command option, specify an image. It can be an user mention (to use their avatar), an image URL, an attached image, `guild`, `myself` (to use your avatar) or `ougi`.")
    .addField("How to use attached images", "If you attach any images to your message when executing this command, you can use them with any command option that requires images, just add `file` and optionally, if you attach more than one image, the index (position of attachment, default is first).\n__" + await ougi.text(msg, "example") + "__\n`::icon file`\n`::icon file 2`\n`::icon file 3`\n`::icon file 4`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed timestamp") {
    embed.addField("::timestamp", "If included, a timestamp will be added to the footer.\n__" + await ougi.text(msg, "example") + "__\n`::timestamp`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed save") {
    embed.addField("::save", "This option allows you to save your embed as a named preset (only available for yourself!).\n__" + await ougi.text(msg, "example") + "__\n`::save Quick RickRoll`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed load") {
    embed.addField("::load", "This option allows you to load a previously saved preset and apply it to your new embed. You may also use it to merge presets or modify them with another command option.\n__" + await ougi.text(msg, "example") + "__\n`::load Quick RickRoll`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed share") {
    embed.addField("::share", "This option allows you to share your preset with an user.\n__" + await ougi.text(msg, "example") + "__\n`::share `" + msg.author.toString() + "` `")
  }

  else if (arguments.join(" ").replace("::", "") == "embed delete") {
    embed.addField("::delete", "This option allows you to delete a previously saved preset.\n__" + await ougi.text(msg, "example") + "__\n`::delete Quick RickRoll`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed deletefield") {
    embed.addField("::deletefield", "This option allows you to delete any field from your embed.\n__" + await ougi.text(msg, "example") + "__\n`::deletefield 2`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed deletesubtitle") {
    embed.addField("::deletesubtitle", "This option allows you to delete any subtitle from your embed.\n__" + await ougi.text(msg, "example") + "__\n`::deletesubtitle 5`")
  }

  else if (arguments.join(" ").replace("::", "") == "embed list") {
    embed.addField("::list", "This option lists all your saved presets.\n__" + await ougi.text(msg, "example") + "__\n`::list`")
  }

  else {
    embed = embed
    .setDescription("Use this command to create your very own custom embed. Just include one or more options with their respective content, after `ougi embed`.")
    .addField("Keep in mind, all of these are optional and there is no specific order.", "You may also execute `ougi help embed` adding the name of any command option to preview detailed information about it.\n" + await ougi.text(msg, "example") + "\n`ougi help embed author`")
    .addField("List of command options for Ougi's embed command", "`::author`, `::authorurl`, `::avatar`, `::title`, `::url`, `::description`, `::subtitle`, `::field`, `::color`, `::thumbnail`, `::image`, `::footer`, `::icon`, `::timestamp`, `::deletefield`, `::deletesubtitle`, `::save`, `::load`, `::share`, `::delete`, `::list`")
    .addField("How to use command options that require images", "After the command option, specify an image. It can be an user mention (to use their avatar), an image URL, an attached image, `guild`, `myself` (to use your avatar) or `ougi`.")
    .addField("How to use attached images", "If you attach any images to your message when executing this command, you can use them with any command option that requires images, just add `file` and optionally, if you attach more than one image, the index (position of attachment, default is first).\n__" + await ougi.text(msg, "example") + "__\n`::avatar file`\n`::thumbnail file 2`\n`::image file 3`\n`::icon file 4`")
    .addField("Pro tip", "*Don't worry, you can always leave out any options you don't need for your embed.*")
    .addField("Try this fully fledged example!", "*This example requires you to **attach an image** for `::image` option, you may modify it in case you don't want to do so.*\n||`ougi embed ::author Honey the gamer doggo ::authorurl https://twitter.com/HakkinDavid/status/1285025274065641472?s=20 ::avatar https://cdn.discordapp.com/attachments/726929586339840072/741572296388640830/20200808_012318.jpg ::title I sleep a lot. ::url https://youtu.be/WDB0zWUpjuw ::description All my homies sleep a lot. ::subtitle Did you know? ::field Despite being a pug, Honey used David's desktop PC. ::subtitle Honey was searching images in Google. ::field What's an image you think Honey probably searched for? Attach it to your message! ::color #faf2d9 ::thumbnail `" + msg.author.toString() + "` ::image file 1 ::footer I love cute doggos like Honey. ::icon guild ::timestamp`||");
  }

  msg.channel.send({embed}).then().catch(console.error);
}

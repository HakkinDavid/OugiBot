module.exports =

  async function (arguments, msg) {
    let embed = await ougi.helpPreset(msg, "embed");

    let option = "";
    if (arguments.length > 1) {
      option = arguments[1].replace("::", "");
    }

    if (option.length >= 1) {
      embed.setDescription((await ougi.text(msg, "commandOption")).replace(/{optionName}/gi, "`::" + option + "`").replace(/{commandName}/gi, "`ougi embed`"));
    }

    switch (option) {
      case "author":
        embed.addFields({ name: "::author", value: await ougi.text(msg, "embedAuthor") + "\n__" + await ougi.text(msg, "example") + "__\n`::author Rick Astley`\n`::author `" + msg.author.toString() + "` `" })
        break;

      case "authorurl":
        embed.addFields({ name: "::authorurl", value: await ougi.text(msg, "embedAuthorURL") + "\n__" + await ougi.text(msg, "example") + "__\n`::authorurl https://twitter.com/RickAstley`" })
        break;

      case "avatar":
        embed.addFields({ name: "::avatar", value: await ougi.text(msg, "embedAvatar") + "\n__" + await ougi.text(msg, "example") + "__\n`::avatar https://www.kissfm.es/wp-content/uploads/2020/02/rickastley.jpg`\n`::avatar file 2`\n`::avatar guild`\n`::avatar myself`\n`::avatar ougi`\n`::avatar `" + msg.author.toString() + "` `" })
        break;

      case "title":
        embed.addFields({ name: "::title", value: await ougi.text(msg, "embedTitle") + "\n__" + await ougi.text(msg, "example") + "__\n`::title Such a good song`" })
        break;

      case "url":
        embed.addFields({ name: "::url", value: await ougi.text(msg, "embedTitleURL") + "\n__" + await ougi.text(msg, "example") + "__\n`::url https://www.youtube.com/watch?v=dQw4w9WgXcQ`" })
        break;

      case "description":
        embed.addFields({ name: "::description", value: await ougi.text(msg, "embedDescription") + "\n__" + await ougi.text(msg, "example") + "__\n`::description You wouldn't get this from any other guy.`\n`::desc Don't tell me you're too blind to see.`" })
        break;

      case "subtitle":
        embed.addFields({ name: "::subtitle", value: await ougi.text(msg, "embedSubtitle") + "\n__" + await ougi.text(msg, "example") + "__\n`::subtitle Take me to your heart. ::subtitle Oh, your love...`" })
        break;

      case "field":
        embed.addFields({ name: "::field", value: await ougi.text(msg, "embedField") + "\n__" + await ougi.text(msg, "example") + "__\n`::field Never let me go ::field It's all I need to know.`" })
        break;

      case "color":
        embed.addFields({ name: "::color", value: await ougi.text(msg, "embedColor") + "\n__" + await ougi.text(msg, "example") + "__\n`::color #e60d80`\n`::color 230, 13, 128`\n`::color blue`" })
        break;

      case "thumbnail":
        embed.addFields({ name: "::thumbnail", value: await ougi.text(msg, "embedThumbnail") + "\n__" + await ougi.text(msg, "example") + "__\n`::thumbnail https://www.kissfm.es/wp-content/uploads/2020/02/rickastley.jpg`\n`::thumbnail file 1`\n`::thumbnail guild`\n`::thumbnail myself`\n`::thumbnail ougi`\n`::thumbnail `" + msg.author.toString() + "` `" })
        break;

      case "image":
        embed.addFields({ name: "::image", value: await ougi.text(msg, "embedImage") + "\n__" + await ougi.text(msg, "example") + "__\n`::image https://www.kissfm.es/wp-content/uploads/2020/02/rickastley.jpg`\n`::image file 4`\n`::image guild`\n`::image myself`\n`::image ougi`\n`::image `" + msg.author.toString() + "` `" })
        break;

      case "footer":
        embed.addFields({ name: "::footer", value: await ougi.text(msg, "embedFooter") + "\n__" + await ougi.text(msg, "example") + "__\n`::footer I got angels on my side, can you see 'em?`" })
        break;

      case "icon":
        embed.addFields({ name: "::icon", value: await ougi.text(msg, "embedIcon") + "\n__" + await ougi.text(msg, "example") + "__\n`::icon https://www.kissfm.es/wp-content/uploads/2020/02/rickastley.jpg`\n`::icon file 3`\n`::icon guild`\n`::icon myself`\n`::icon ougi`\n`::icon `" + msg.author.toString() + "` `" })
        break;

      case "timestamp":
        embed.addFields({ name: "::timestamp", value: await ougi.text(msg, "embedTimestamp") + "\n__" + await ougi.text(msg, "example") + "__\n`::timestamp`" })
        break;

      case "save":
        embed.addFields({ name: "::save", value: await ougi.text(msg, "embedSave") + "\n__" + await ougi.text(msg, "example") + "__\n`::save Quick RickRoll`" })
        break;

      case "load":
        embed.addFields({ name: "::load", value: await ougi.text(msg, "embedLoad") + "\n__" + await ougi.text(msg, "example") + "__\n`::load Quick RickRoll`" })
        break;

      case "share":
        embed.addFields({ name: "::share", value: await ougi.text(msg, "embedShare") + "\n__" + await ougi.text(msg, "example") + "__\n`::share `" + msg.author.toString() + "` `" })
        break;

      case "delete":
        embed.addFields({ name: "::delete", value: await ougi.text(msg, "embedDelete") + "\n__" + await ougi.text(msg, "example") + "__\n`::delete Quick RickRoll`" })
        break;

      case "deletefield":
        embed.addFields({ name: "::deletefield", value: await ougi.text(msg, "embedDeleteField") + "\n__" + await ougi.text(msg, "example") + "__\n`::deletefield 2`" })
        break;

      case "deletesubtitle":
        embed.addFields({ name: "::deletesubtitle", value: await ougi.text(msg, "embedDeleteSubtitle") + "\n__" + await ougi.text(msg, "example") + "__\n`::deletesubtitle 5`" })
        break;

      case "list":
        embed.addFields({ name: "::list", value: await ougi.text(msg, "embedList") + "\n__" + await ougi.text(msg, "example") + "__\n`::list`" })
        break;

      default:
        embed
          .setDescription((await ougi.text(msg, "embedHelpDescription")).replace(/{commandName}/gi, "`ougi embed`"))
          .addFields({ name: await ougi.text(msg, "embedHelpDisclaimer"), value: await ougi.text(msg, "embedExtraHelp") + "\n" + await ougi.text(msg, "example") + "\n`ougi help embed author`" })
          .addFields({ name: await ougi.text(msg, "embedOptionsList"), value: "`::author`, `::authorurl`, `::avatar`, `::title`, `::url`, `::description`, `::subtitle`, `::field`, `::color`, `::thumbnail`, `::image`, `::footer`, `::icon`, `::timestamp`, `::deletefield`, `::deletesubtitle`, `::save`, `::load`, `::share`, `::delete`, `::list`" })
          .addFields({ name: await ougi.text(msg, "embedRequireImageTitle"), value: (await ougi.text(msg, "embedRequireImage")).replace(/{guildOption}/gi, "`guild`").replace(/{userselfOption}/gi, "`myself`").replace(/{ougiOption}/gi, "`ougi`") })
          .addFields({ name: await ougi.text(msg, "embedAttachedImageTitle"), value: (await ougi.text(msg, "embedAttachedImage")).replace(/{fileOption}/gi, "`file`") + "\n__" + await ougi.text(msg, "example") + "__\n`::avatar file`\n`::thumbnail file 2`\n`::image file 3`\n`::icon file 4`" })
          .addFields({ name: await ougi.text(msg, "example"), value: "`ougi embed ::avatar `" + msg.author.toString() + "` ::author `" + msg.author.toString() + "` ::color blue ::title I love using Ougi ::image https://i.ytimg.com/vi/M9fFb6pDUK0/maxresdefault.jpg`" })
        break;
    }

    if (option == "avatar" || option == "thumbnail" || option == "image" || option == "icon") {
      embed
        .addFields({ name: await ougi.text(msg, "embedRequireImageTitle"), value: (await ougi.text(msg, "embedRequireImage")).replace(/{guildOption}/gi, "`guild`").replace(/{userselfOption}/gi, "`myself`").replace(/{ougiOption}/gi, "`ougi`") })
        .addFields({ name: await ougi.text(msg, "embedAttachedImageTitle"), value: (await ougi.text(msg, "embedAttachedImage")).replace(/{fileOption}/gi, "`file`") + "\n__" + await ougi.text(msg, "example") + "__\n`::{optionName} file`\n`::{optionName} file 2`\n`::{optionName} file 3`\n`::{optionName} file 4`".replace(/{optionName}/gi, option) });
    }

    msg.channel.send({ embeds: [embed] }).catch(console.error);
  }

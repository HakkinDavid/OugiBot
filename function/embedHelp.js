module.exports =

  async function (arguments, msg) {
    let embed = await ougi.helpPreset(msg, "embed");

    let option = "";
    if (arguments.length > 1) {
      option = arguments[1].replace("::", "");
    }

    if (option.length >= 1) {
      embed.setDescription(await ougi.text({ msg, stringID: "commandOption", values: { optionName: "`::" + option + "`", commandName: "`ougi embed`" } }));
    }

    switch (option) {
      case "author":
        embed.addFields({ name: "::author", value: await ougi.text({ msg, stringID: "embedAuthor" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::author Rick Astley`\n`::author `" + msg.author.toString() + "` `" })
        break;

      case "authorurl":
        embed.addFields({ name: "::authorurl", value: await ougi.text({ msg, stringID: "embedAuthorURL" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::authorurl https://twitter.com/RickAstley`" })
        break;

      case "avatar":
        embed.addFields({ name: "::avatar", value: await ougi.text({ msg, stringID: "embedAvatar" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::avatar https://www.kissfm.es/wp-content/uploads/2020/02/rickastley.jpg`\n`::avatar file 2`\n`::avatar guild`\n`::avatar myself`\n`::avatar ougi`\n`::avatar `" + msg.author.toString() + "` `" })
        break;

      case "title":
        embed.addFields({ name: "::title", value: await ougi.text({ msg, stringID: "embedTitle" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::title Such a good song`" })
        break;

      case "url":
        embed.addFields({ name: "::url", value: await ougi.text({ msg, stringID: "embedTitleURL" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::url https://www.youtube.com/watch?v=dQw4w9WgXcQ`" })
        break;

      case "description":
        embed.addFields({ name: "::description", value: await ougi.text({ msg, stringID: "embedDescription" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::description You wouldn't get this from any other guy.`\n`::desc Don't tell me you're too blind to see.`" })
        break;

      case "subtitle":
        embed.addFields({ name: "::subtitle", value: await ougi.text({ msg, stringID: "embedSubtitle" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::subtitle Take me to your heart. ::subtitle Oh, your love...`" })
        break;

      case "field":
        embed.addFields({ name: "::field", value: await ougi.text({ msg, stringID: "embedField" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::field Never let me go ::field It's all I need to know.`" })
        break;

      case "color":
        embed.addFields({ name: "::color", value: await ougi.text({ msg, stringID: "embedColor" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::color #e60d80`\n`::color 230, 13, 128`\n`::color blue`" })
        break;

      case "thumbnail":
        embed.addFields({ name: "::thumbnail", value: await ougi.text({ msg, stringID: "embedThumbnail" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::thumbnail https://www.kissfm.es/wp-content/uploads/2020/02/rickastley.jpg`\n`::thumbnail file 1`\n`::thumbnail guild`\n`::thumbnail myself`\n`::thumbnail ougi`\n`::thumbnail `" + msg.author.toString() + "` `" })
        break;

      case "image":
        embed.addFields({ name: "::image", value: await ougi.text({ msg, stringID: "embedImage" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::image https://www.kissfm.es/wp-content/uploads/2020/02/rickastley.jpg`\n`::image file 4`\n`::image guild`\n`::image myself`\n`::image ougi`\n`::image `" + msg.author.toString() + "` `" })
        break;

      case "footer":
        embed.addFields({ name: "::footer", value: await ougi.text({ msg, stringID: "embedFooter" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::footer I got angels on my side, can you see 'em?`" })
        break;

      case "icon":
        embed.addFields({ name: "::icon", value: await ougi.text({ msg, stringID: "embedIcon" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::icon https://www.kissfm.es/wp-content/uploads/2020/02/rickastley.jpg`\n`::icon file 3`\n`::icon guild`\n`::icon myself`\n`::icon ougi`\n`::icon `" + msg.author.toString() + "` `" })
        break;

      case "timestamp":
        embed.addFields({ name: "::timestamp", value: await ougi.text({ msg, stringID: "embedTimestamp" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::timestamp`" })
        break;

      case "save":
        embed.addFields({ name: "::save", value: await ougi.text({ msg, stringID: "embedSave" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::save Quick RickRoll`" })
        break;

      case "load":
        embed.addFields({ name: "::load", value: await ougi.text({ msg, stringID: "embedLoad" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::load Quick RickRoll`" })
        break;

      case "share":
        embed.addFields({ name: "::share", value: await ougi.text({ msg, stringID: "embedShare" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::share `" + msg.author.toString() + "` `" })
        break;

      case "delete":
        embed.addFields({ name: "::delete", value: await ougi.text({ msg, stringID: "embedDelete" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::delete Quick RickRoll`" })
        break;

      case "deletefield":
        embed.addFields({ name: "::deletefield", value: await ougi.text({ msg, stringID: "embedDeleteField" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::deletefield 2`" })
        break;

      case "deletesubtitle":
        embed.addFields({ name: "::deletesubtitle", value: await ougi.text({ msg, stringID: "embedDeleteSubtitle" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::deletesubtitle 5`" })
        break;

      case "list":
        embed.addFields({ name: "::list", value: await ougi.text({ msg, stringID: "embedList" }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::list`" })
        break;

      default:
        embed
          .setDescription(await ougi.text({ msg, stringID: "embedHelpDescription", values: { commandName: "`ougi embed`" } }))
          .addFields({ name: await ougi.text({ msg, stringID: "embedHelpDisclaimer" }), value: await ougi.text({ msg, stringID: "embedExtraHelp", values: { command: "`ougi help embed`" } }) + "\n" + await ougi.text({ msg, stringID: "example" }) + "\n`ougi help embed author`" })
          .addFields({ name: await ougi.text({ msg, stringID: "embedOptionsList" }), value: "`::author`, `::authorurl`, `::avatar`, `::title`, `::url`, `::description`, `::subtitle`, `::field`, `::color`, `::thumbnail`, `::image`, `::footer`, `::icon`, `::timestamp`, `::deletefield`, `::deletesubtitle`, `::save`, `::load`, `::share`, `::delete`, `::list`" })
          .addFields({ name: await ougi.text({ msg, stringID: "embedRequireImageTitle" }), value: await ougi.text({ msg, stringID: "embedRequireImage", values: { guildOption: "`guild`", userselfOption: "`myself`", ougiOption: "`ougi`" } }) })
          .addFields({ name: await ougi.text({ msg, stringID: "embedAttachedImageTitle" }), value: await ougi.text({ msg, stringID: "embedAttachedImage", values: { fileOption: "`file`" } }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::avatar file`\n`::thumbnail file 2`\n`::image file 3`\n`::icon file 4`" })
          .addFields({ name: await ougi.text({ msg, stringID: "example" }), value: "`ougi embed ::avatar `" + msg.author.toString() + "` ::author `" + msg.author.toString() + "` ::color blue ::title I love using Ougi ::image https://i.ytimg.com/vi/M9fFb6pDUK0/maxresdefault.jpg`" })
        break;
    }

    if (option == "avatar" || option == "thumbnail" || option == "image" || option == "icon") {
      embed
        .addFields({ name: await ougi.text({ msg, stringID: "embedRequireImageTitle" }), value: await ougi.text({ msg, stringID: "embedRequireImage", values: { guildOption: "`guild`", userselfOption: "`myself`", ougiOption: "`ougi`" } }) })
        .addFields({ name: await ougi.text({ msg, stringID: "embedAttachedImageTitle" }), value: await ougi.text({ msg, stringID: "embedAttachedImage", values: { fileOption: "`file`" } }) + "\n__" + await ougi.text({ msg, stringID: "example" }) + "__\n`::{optionName} file`\n`::{optionName} file 2`\n`::{optionName} file 3`\n`::{optionName} file 4`".replace(/{optionName}/gi, option) });
    }

    msg.channel.send({ embeds: [embed] }).catch(console.error);
  }

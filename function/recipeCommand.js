module.exports =

async function (arguments, msg) {
    let searchParams = arguments.join(" ");
    let langCode = undefined;
    if (settingsOBJ.lang.hasOwnProperty(msg.author.id)) {
        langCode = settingsOBJ.lang[msg.author.id]
    }
    if (msg.channel.type == "text") {
        if (settingsOBJ.lang.hasOwnProperty(msg.guild.id)) {
        langCode = settingsOBJ.lang[msg.guild.id];
        }
    }
    if (langCode !== undefined && langCode !== 'en') {
        await translate(searchParams, {from: langCode.replace('mx', 'es'), to: "en"}).then(res => {
            if (res.from.language.iso != "en") {
              searchParams = res.text;
            }
        }).catch(err => {
            console.error(err);
        });
    }
    const options = {
        method: 'GET',
        url: 'https://edamam-recipe-search.p.rapidapi.com/search',
        qs: {
            q: searchParams
        },
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI,
          'x-rapidapi-host': 'edamam-recipe-search.p.rapidapi.com',
          useQueryString: true
        }
      };
      
    await request(options, async (error, response, body) => {
        if (error) {
            console.error(error);
            return;
        }

        body = JSON.parse(body);
        
        let recipesOBJ = body.hits;
        if (recipesOBJ.length === 0) {
            msg.channel.send(await ougi.text(msg, "resultsZero"));
            return;
        }
    
        let prettyRecipe = recipesOBJ[Math.floor(Math.random()*recipesOBJ.length)].recipe;
    
        let embed = new Discord.MessageEmbed()
        .setTitle(prettyRecipe.label)
        .setURL(prettyRecipe.url)
        .setAuthor(prettyRecipe.source)
        .setThumbnail(prettyRecipe.image)
        .setDescription((await ougi.text(msg, "calories")).replace(/{num}/gi, "`" + prettyRecipe.calories + "`") + "\n**" + (await ougi.text(msg, "tags")) + "**\n" + (await ougi.text(msg, [ ... prettyRecipe.dietLabels, ... prettyRecipe.healthLabels ].join(", "), true)))
        .addField(await ougi.text(msg, "ingredients"), await ougi.text(msg, prettyRecipe.ingredientLines.join("\n"), true))
        .setColor("#6E2C00")
        .setFooter("recipeEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
        .setTimestamp();
    
        msg.channel.send(embed);
    });
}
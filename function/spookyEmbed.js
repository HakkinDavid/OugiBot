module.exports =

    async function (msg) {
        /*-----------------------------------*/
        while (msg.content.includes('  ')) {
            msg.content = msg.content.replace('  ', ' ')
        }
        while (msg.content.includes('\n\n')) {
            msg.content = msg.content.replace('\n\n', '\n')
        }
        while (msg.content.includes('\n')) {
            msg.content = msg.content.replace('\n', ' ')
        }
        let spookyCake = msg.content;
        let spookySlices = spookyCake.split(" ");
        let spookyCommand = spookySlices[1];
        let arguments = spookySlices.slice(2);
        /*-----------------------------------*/

        let thisMessage = arguments.join(" ");
        let breakChocolate = thisMessage.split("::").slice(1);
        if (breakChocolate.length < 1) {
            msg.channel.send(await ougi.text(msg, "spooky_needOneArg"));
            return;
        }
        let fieldsArray = [];
        let fieldsTitles = [];
        let footerArray = [];
        let authorArray = [];
        let presetName = "";
        let sharedWith = [];
        let attachmentsForEmbed = [];
        let listOfPresets = [];

        msg.attachments.map((files) => attachmentsForEmbed.push(files.url));

        if (msg.guild == null) {
            var serverIcon = client.user.avatarURL({ dynamic: true, size: 4096 });
        }
        else {
            var serverIcon = msg.guild.iconURL();
        }

        let spookyConstructor = new Discord.EmbedBuilder();
        for (i = 0; breakChocolate.length > i; i++) {
            let material = breakChocolate[i];
            if (material.endsWith(" ")) {
                material = material.slice(0, material.length - 1)
            }
            if (material.startsWith("field")) {
                material = material.substring(5);
                if (material.startsWith(" ")) {
                    material = material.slice(1)
                }
                if (material.length > 1024) {
                    msg.channel.send(await ougi.text(msg, "spooky_fieldLimit"));
                    return;
                }
                if (material.length < 1) {
                    material = "\u200b";
                }
                if (fieldsArray.length == 25) {
                    msg.channel.send(await ougi.text(msg, "spooky_maxFields"));
                    return;
                }
                fieldsArray.push(material);
            }
            else if (material.startsWith("deletefield ")) {
                material = material.substring(12);
                if (isNaN(material)) {
                    msg.channel.send(await ougi.text(msg, "spooky_deleteFieldIndex"));
                    return;
                }
                if (material <= 1) {
                    material = 1
                }
                material = material - 1;
                fieldsArray[material] = "/DELETE/";
            }
            else if (material.startsWith("subtitle")) {
                material = material.substring(8);
                if (material.startsWith(" ")) {
                    material = material.slice(1)
                }
                if (material.length > 1024) {
                    msg.channel.send(await ougi.text(msg, "spooky_subtitleLimit"));
                    return;
                }
                if (material.length < 1) {
                    material = "\u200b";
                }
                if (fieldsTitles.length == 25) {
                    msg.channel.send(await ougi.text(msg, "spooky_maxSubtitles"));
                    return;
                }
                fieldsTitles.push(material);
            }
            else if (material.startsWith("deletesubtitle ")) {
                material = material.substring(15);
                if (isNaN(material)) {
                    msg.channel.send(await ougi.text(msg, "spooky_deleteSubtitleIndex"));
                    return;
                }
                if (material <= 1) {
                    material = 1
                }
                material = material - 1;
                fieldsTitles[material] = undefined;
            }
            else if (material.startsWith("title ")) {
                material = material.substring(6);
                if (material.length < 1 || material.length > 256) {
                    msg.channel.send(await ougi.text(msg, "spooky_titleLimit"));
                    return;
                }
                spookyConstructor.setTitle(material)
            }
            else if (material.startsWith("save ")) {
                material = material.substring(5);
                if (material.length < 1 || material.length > 100) {
                    msg.channel.send(await ougi.text(msg, "spooky_presetNameLimit"));
                    return;
                }
                breakChocolate.splice(i, 1);
                presetName = material;
                i--;
            }
            else if (material.startsWith("share ")) {
                material = material.substring(6);
                if (material.startsWith("<@") && material.endsWith(">")) {
                    let mentionedUser = material.slice(2, material.length - 1).replace("!", "");
                    if (!client.users.cache.has(mentionedUser)) {
                        msg.channel.send(await ougi.text(msg, "spooky_mentionShare"));
                        return;
                    }
                    sharedWith.push(mentionedUser);
                    breakChocolate.splice(i, 1);
                    i--;
                }
                else {
                    msg.channel.send(await ougi.text(msg, "spooky_mentionShare"));
                    return;
                }
            }
            else if (material.startsWith("load ")) {
                material = material.substring(5);
                if (material.length < 1 || material.length > 100) {
                    msg.channel.send(await ougi.text(msg, "spooky_presetNameLimit"));
                    return;
                }
                let myLoad = ougi.db().loadEmbedPresets();
                let aPreset = material + "::" + msg.author.id;
                if (myLoad.hasOwnProperty(aPreset)) {
                    let gonnaPull = myLoad[aPreset].slice().reverse();
                    breakChocolate.splice(i, 1);
                    for (e = 0; gonnaPull.length > e; e++) {
                        breakChocolate.splice(i, 0, gonnaPull[e]);
                    }
                    i--
                }
                else {
                    const noPresetTemplate = await ougi.text(msg, "spooky_noSuchPreset");
                    msg.channel.send(noPresetTemplate.replace(/{preset}/g, material));
                    return;
                }
            }
            else if (material.startsWith("list")) {
                let myLoad = ougi.db().loadEmbedPresets();
                let aPreset = "::" + msg.author.id;
                let allPresets = Object.keys(myLoad);
                for (e = 0; allPresets.length > e; e++) {
                    if (allPresets[e].endsWith(aPreset) && !listOfPresets.includes(allPresets[e])) {
                        listOfPresets.push(allPresets[e].replace(aPreset, ""));
                    }
                }
                if (listOfPresets.length < 1) {
                    msg.channel.send(await ougi.text(msg, "spooky_noPresetsSaved"));
                    return;
                }
                breakChocolate.splice(i, 1);
                i--;
            }
            else if (material.startsWith("delete ")) {
                material = material.substring(7);
                if (material.length < 1 || material.length > 100) {
                    msg.channel.send(await ougi.text(msg, "spooky_presetNameLimit"));
                    return;
                }
                let aPreset = material + "::" + msg.author.id;
                ougi.db().deleteEmbedPreset(aPreset);
                breakChocolate.splice(i, 1);
                const deletedPresetTemplate = await ougi.text(msg, "spooky_deletedPreset");
                msg.channel.send(deletedPresetTemplate.replace(/{preset}/g, material));
                i--;
            }
            else if (material.startsWith("author ")) {
                material = material.substring(7);
                if (material.length < 1 || material.length > 256) {
                    msg.channel.send(await ougi.text(msg, "spooky_authorNameLimit"));
                    return;
                }
                if (material.startsWith("<@") && material.endsWith(">")) {
                    let mentionedUser = material.slice(2, material.length - 1).replace("!", "");
                    if (!client.users.cache.has(mentionedUser)) {
                        msg.channel.send(await ougi.text(msg, "spooky_authorValidUser"));
                        return;
                    }
                    authorArray[0] = client.users.cache.get(mentionedUser).username;
                }
                else {
                    authorArray[0] = material;
                }
            }
            else if (material.startsWith("authorurl ")) {
                material = material.substring(10);
                if (!material.includes(".")) {
                    msg.channel.send(await ougi.text(msg, "spooky_authorUrlTld")).catch(console.error);
                    return;
                }

                if (material.startsWith("http:")) {
                    msg.channel.send(await ougi.text(msg, "spooky_authorUrlHttps")).catch(console.error);
                    return;
                }

                if (!material.startsWith("https://")) {
                    material = "https://" + material;
                }
                authorArray[2] = material;
            }
            else if (material.startsWith("description ")) {
                material = material.substring(12);
                if (material.length < 1 || material.length > 2048) {
                    msg.channel.send(await ougi.text(msg, "spooky_descriptionLimit"));
                    return;
                }
                spookyConstructor.setDescription(material)
            }
            else if (material.startsWith("desc ")) {
                material = material.substring(5);
                if (material.length < 1 || material.length > 2048) {
                    msg.channel.send(await ougi.text(msg, "spooky_descriptionLimit"));
                    return;
                }
                spookyConstructor.setDescription(material)
            }
            else if (material.startsWith("footer ")) {
                material = material.substring(7);
                if (material.length < 1 || material.length > 2048) {
                    msg.channel.send(await ougi.text(msg, "spooky_footerLimit"));
                    return;
                }
                footerArray[0] = material + " | spookyEmbed by " + msg.author.username;
            }
            else if (material.startsWith("icon ")) {
                material = material.substring(5).replace("guild", serverIcon).replace("ougi", client.user.avatarURL({ dynamic: true, size: 4096 })).replace("myself", msg.author.avatarURL({ dynamic: true, size: 4096 }));
                if (material.startsWith("<@") && material.endsWith(">")) {
                    let mentionedUser = material.slice(2, material.length - 1).replace("!", "");
                    if (!client.users.cache.has(mentionedUser)) {
                        msg.channel.send(await ougi.text(msg, "spooky_footerIconRequirement"));
                        return;
                    }
                    footerArray[1] = client.users.cache.get(mentionedUser).avatarURL({ dynamic: true, size: 4096 });
                }
                else if (material.startsWith("file")) {
                    if (attachmentsForEmbed.length < 1) {
                        msg.channel.send(await ougi.text(msg, "spooky_noFilesAttached"));
                        return;
                    }
                    material = material.substring(4);
                    if (material.startsWith(" ")) {
                        material = material.substring(1);
                    }
                    if (material.length < 1) {
                        material = 1;
                    }
                    if (isNaN(material)) {
                        msg.channel.send(await ougi.text(msg, "spooky_fileIndexPrompt"));
                        return;
                    }
                    if (material < 1) {
                        material = 1;
                    }
                    material--;
                    if (material > attachmentsForEmbed.length) {
                        const invalidFileIdxTemplate = await ougi.text(msg, "spooky_invalidFileIndex");
                        msg.channel.send(invalidFileIdxTemplate.replace(/{count}/g, attachmentsForEmbed.length));
                        return;
                    }
                    if (!isImageUrl(attachmentsForEmbed[material])) {
                        msg.channel.send(await ougi.text(msg, "spooky_fileMustBeImage"));
                        return;
                    }
                    footerArray[1] = attachmentsForEmbed[material];
                }
                else {
                    if (!isImageUrl(material)) {
                        msg.channel.send(await ougi.text(msg, "spooky_footerIconRequirement"));
                        return;
                    }
                    footerArray[1] = material;
                }
            }
            else if (material.startsWith("avatar ")) {
                material = material.substring(7).replace("guild", serverIcon).replace("ougi", client.user.avatarURL({ dynamic: true, size: 4096 })).replace("myself", msg.author.avatarURL({ dynamic: true, size: 4096 }));
                if (material.startsWith("<@") && material.endsWith(">")) {
                    let mentionedUser = material.slice(2, material.length - 1).replace("!", "");
                    if (!client.users.cache.has(mentionedUser)) {
                        msg.channel.send(await ougi.text(msg, "spooky_avatarRequirement"));
                        return;
                    }
                    authorArray[1] = client.users.cache.get(mentionedUser).avatarURL({ dynamic: true, size: 4096 });
                }
                else if (material.startsWith("file")) {
                    if (attachmentsForEmbed.length < 1) {
                        msg.channel.send(await ougi.text(msg, "spooky_noFilesAttached"));
                        return;
                    }
                    material = material.substring(4);
                    if (material.startsWith(" ")) {
                        material = material.substring(1);
                    }
                    if (material.length < 1) {
                        material = 1;
                    }
                    if (isNaN(material)) {
                        msg.channel.send(await ougi.text(msg, "spooky_fileIndexPrompt"));
                        return;
                    }
                    if (material < 1) {
                        material = 1;
                    }
                    material--;
                    if (material > attachmentsForEmbed.length) {
                        const invalidFileIdxTemplate = await ougi.text(msg, "spooky_invalidFileIndex");
                        msg.channel.send(invalidFileIdxTemplate.replace(/{count}/g, attachmentsForEmbed.length));
                        return;
                    }
                    if (!isImageUrl(attachmentsForEmbed[material])) {
                        msg.channel.send(await ougi.text(msg, "spooky_fileMustBeImage"));
                        return;
                    }
                    authorArray[1] = attachmentsForEmbed[material];
                }
                else {
                    if (!isImageUrl(material)) {
                        msg.channel.send(await ougi.text(msg, "spooky_avatarRequirement"));
                        return;
                    }
                    authorArray[1] = material;
                }
            }
            else if (material.startsWith("thumbnail ")) {
                material = material.substring(10).replace("guild", serverIcon).replace("ougi", client.user.avatarURL({ dynamic: true, size: 4096 })).replace("myself", msg.author.avatarURL({ dynamic: true, size: 4096 }));
                if (material.startsWith("<@") && material.endsWith(">")) {
                    let mentionedUser = material.slice(2, material.length - 1).replace("!", "");
                    if (!client.users.cache.has(mentionedUser)) {
                        msg.channel.send(await ougi.text(msg, "spooky_thumbnailRequirement"));
                        return;
                    }
                    spookyConstructor.setThumbnail(client.users.cache.get(mentionedUser).avatarURL({ dynamic: true, size: 4096 }));
                }
                else if (material.startsWith("file")) {
                    if (attachmentsForEmbed.length < 1) {
                        msg.channel.send(await ougi.text(msg, "spooky_noFilesAttached"));
                        return;
                    }
                    material = material.substring(4);
                    if (material.startsWith(" ")) {
                        material = material.substring(1);
                    }
                    if (material.length < 1) {
                        material = 1;
                    }
                    if (isNaN(material)) {
                        msg.channel.send(await ougi.text(msg, "spooky_fileIndexPrompt"));
                        return;
                    }
                    if (material < 1) {
                        material = 1;
                    }
                    material--;
                    if (material > attachmentsForEmbed.length) {
                        const invalidFileIdxTemplate = await ougi.text(msg, "spooky_invalidFileIndex");
                        msg.channel.send(invalidFileIdxTemplate.replace(/{count}/g, attachmentsForEmbed.length));
                        return;
                    }
                    if (!isImageUrl(attachmentsForEmbed[material])) {
                        msg.channel.send(await ougi.text(msg, "spooky_fileMustBeImage"));
                        return;
                    }
                    spookyConstructor.setThumbnail(attachmentsForEmbed[material]);
                }
                else {
                    if (!isImageUrl(material)) {
                        msg.channel.send(await ougi.text(msg, "spooky_thumbnailRequirement"));
                        return;
                    }
                    spookyConstructor.setThumbnail(material);
                }
            }
            else if (material.startsWith("image ")) {
                material = material.substring(6).replace("guild", serverIcon).replace("ougi", client.user.avatarURL({ dynamic: true, size: 4096 })).replace("myself", msg.author.avatarURL({ dynamic: true, size: 4096 }));
                if (material.startsWith("<@") && material.endsWith(">")) {
                    let mentionedUser = material.slice(2, material.length - 1).replace("!", "");
                    if (!client.users.cache.has(mentionedUser)) {
                        msg.channel.send(await ougi.text(msg, "spooky_imageRequirement"));
                        return;
                    }
                    spookyConstructor.setImage(client.users.cache.get(mentionedUser).avatarURL({ dynamic: true, size: 4096 }));
                }
                else if (material.startsWith("file")) {
                    if (attachmentsForEmbed.length < 1) {
                        msg.channel.send(await ougi.text(msg, "spooky_noFilesAttached"));
                        return;
                    }
                    material = material.substring(4);
                    if (material.startsWith(" ")) {
                        material = material.substring(1);
                    }
                    if (material.length < 1) {
                        material = 1;
                    }
                    if (isNaN(material)) {
                        msg.channel.send(await ougi.text(msg, "spooky_fileIndexPrompt"));
                        return;
                    }
                    if (material < 1) {
                        material = 1;
                    }
                    material--;
                    if (material > attachmentsForEmbed.length) {
                        const invalidFileIdxTemplate = await ougi.text(msg, "spooky_invalidFileIndex");
                        msg.channel.send(invalidFileIdxTemplate.replace(/{count}/g, attachmentsForEmbed.length));
                        return;
                    }
                    if (!isImageUrl(attachmentsForEmbed[material])) {
                        msg.channel.send(await ougi.text(msg, "spooky_fileMustBeImage"));
                        return;
                    }
                    spookyConstructor.setImage(attachmentsForEmbed[material]);
                }
                else {
                    if (!isImageUrl(material)) {
                        msg.channel.send(await ougi.text(msg, "spooky_imageRequirement"));
                        return;
                    }
                    spookyConstructor.setImage(material);
                }
            }
            else if (material.startsWith("url ")) {
                material = material.substring(4);
                if (!material.includes(".")) {
                    msg.channel.send(await ougi.text(msg, "spooky_invalidUrl")).catch(console.error);
                    return;
                }
                if (material.startsWith("http:")) {
                    msg.channel.send(await ougi.text(msg, "spooky_urlHttps")).catch(console.error);
                    return;
                }

                if (!material.startsWith("https://")) {
                    material = "https://" + material;
                }
                spookyConstructor.setURL(material)
            }
            else if (material.startsWith("timestamp")) {
                spookyConstructor.setTimestamp();
            }
            else if (material.startsWith("color ")) {
                let pseudoColor = "";
                material = material.substring(6);
                if (!material.startsWith("#")) {
                    pseudoColor = "#" + material;
                }
                else {
                    pseudoColor = material;
                }
                if (isHexcolor(pseudoColor)) {
                    spookyConstructor.setColor(pseudoColor);
                }
                else {
                    while (material.includes(" ")) {
                        material = material.replace(" ", ",");
                    }
                    while (material.includes(",,")) {
                        material = material.replace(",,", ",");
                    }
                    let rgbArray = material.split(",");
                    if (rgbArray.length <= 3 && !isNaN(rgbArray[0]) && !isNaN(rgbArray[1]) && !isNaN(rgbArray[2])) {
                        if (rgbArray[0] > 255 || rgbArray[1] > 255 || rgbArray[2] > 255) {
                            msg.channel.send(await ougi.text(msg, "spooky_colorRequirement"));
                            return;
                        }
                        spookyConstructor.setColor(material);
                    }
                    else {
                        material = material.toUpperCase().replace("YELLOW", "GOLD");
                        while (material.includes(",")) {
                            material = material.replace(",", "_");
                        }
                        let coolColors = ["DEFAULT", "WHITE", "AQUA", "GREEN", "BLUE", "PURPLE", "LUMINOUS_VIVID_PINK", "GOLD", "ORANGE", "RED", "GREY", "DARKER_GREY", "NAVY", "DARK_AQUA", "DARK_GREEN", "DARK_BLUE", "DARK_PURPLE", "DARK_VIVID_PINK", "DARK_GOLD", "DARK_ORANGE", "DARK_RED", "DARK_GREY", "LIGHT_GREY", "DARK_NAVY", "BLACK", "RANDOM"];
                        if (coolColors.includes(material)) {
                            spookyConstructor.setColor(material);
                        }
                        else {
                            msg.channel.send(await ougi.text(msg, "spooky_colorRequirement"));
                            return;
                        }
                    }
                }
            }
            else {
                msg.channel.send(await ougi.text(msg, "spooky_syntaxHelp"));
                return;
            }
        }
        if (footerArray[0] != undefined && footerArray[1] == undefined) {
            spookyConstructor.setFooter({ text: footerArray[0] })
        }
        else if (footerArray[0] == undefined && footerArray[1] != undefined) {
            spookyConstructor.setFooter({ text: "\u200b", icon: footerArray[1] })
        }
        else if (footerArray[0] != undefined && footerArray[1] != undefined) {
            spookyConstructor.setFooter({ text: footerArray[0], icon: footerArray[1] })
        }

        if (authorArray[0] != undefined && authorArray[1] == undefined && authorArray[2] == undefined) {
            spookyConstructor.setAuthor({ name: authorArray[0] })
        }
        else if (authorArray[0] == undefined && authorArray[1] != undefined && authorArray[2] == undefined) {
            spookyConstructor.setAuthor({ name: "\u200b", icon: authorArray[1] })
        }
        else if (authorArray[0] != undefined && authorArray[1] != undefined && authorArray[2] == undefined) {
            spookyConstructor.setAuthor({ name: authorArray[0], icon: authorArray[1] })
        }
        else if (authorArray[0] != undefined && authorArray[1] == undefined && authorArray[2] != undefined) {
            spookyConstructor.setAuthor({ name: authorArray[0], icon: undefined, url: authorArray[2] })
        }
        else if (authorArray[0] == undefined && authorArray[1] != undefined && authorArray[2] != undefined) {
            spookyConstructor.setAuthor({ name: "\u200b", icon: authorArray[1], url: authorArray[2] })
        }
        else if (authorArray[0] != undefined && authorArray[1] != undefined && authorArray[2] != undefined) {
            spookyConstructor.setAuthor({ name: authorArray[0], icon: authorArray[1], url: authorArray[2] })
        }

        for (i = 0; fieldsArray.length > i || fieldsTitles.length > i; i++) {
            if (fieldsArray[i] == "/DELETE/" && fieldsTitles[i] != "/DELETE/") {
                fieldsArray.splice(i, 1)
                i--;
            }
            else if (fieldsTitles[i] == "/DELETE/" && fieldsArray[i] != "/DELETE/") {
                fieldsTitles.splice(i, 1)
                i--;
            }
            else if (fieldsTitles[i] == "/DELETE/" && fieldsArray[i] == "/DELETE/") {
                fieldsArray.splice(i, 1)
                fieldsTitles.splice(i, 1)
                i--;
            }
        }

        for (i = 0; fieldsArray.length > i || fieldsTitles.length > i; i++) {
            if (fieldsArray[i] != undefined && fieldsTitles[i] != undefined) {
                spookyConstructor.addFields({ name: fieldsTitles[i], value: fieldsArray[i] })
            }
            else if (fieldsArray[i] == undefined && fieldsTitles[i] != undefined) {
                spookyConstructor.addFields({ name: fieldsTitles[i], value: "\u200b" })
            }
            else if (fieldsArray[i] != undefined && fieldsTitles[i] == undefined) {
                spookyConstructor.addFields({ name: "\u200b", value: fieldsArray[i] })
            }
        }

        if (breakChocolate.length >= 1) {
            msg.channel.send({ embeds: [spookyConstructor] }).then(
                setTimeout(
                    function () {
                        msg.delete().catch(O_o => { })
                    }, 2000, msg
                )
            ).catch(async err => {
                console.error("Error sending spookyEmbed:", err);
                msg.channel.send(await ougi.text(msg, "spooky_failedToSend")).catch(console.error);
            });
        }

        if (presetName.length >= 1) {
            if (breakChocolate.length < 1) {
                msg.channel.send(await ougi.text(msg, "spooky_embedEmpty"));
                return;
            }
            let personalizedPresetName = presetName + "::" + msg.author.id;
            ougi.db().saveEmbedPreset(personalizedPresetName, breakChocolate);

            const savedPresetTemplate = await ougi.text(msg, "spooky_savedPreset");
            msg.channel.send(savedPresetTemplate.replace(/{preset}/g, presetName));
        }

        if (sharedWith.length >= 1) {
            if (breakChocolate.length < 1) {
                msg.channel.send(await ougi.text(msg, "spooky_embedEmpty"));
                return;
            }
            let circleOfSharing = [];
            for (i = 0; i < sharedWith.length; i++) {
                circleOfSharing.push(client.users.cache.get(sharedWith[i]).username);
                let everyPresetShare = msg.author.username + "'s preset::" + sharedWith[i];
                ougi.db().saveEmbedPreset(everyPresetShare, breakChocolate);
            }

            const sharedPresetTemplate = await ougi.text(msg, "spooky_sharedPreset");
            msg.channel.send(
                sharedPresetTemplate
                    .replace(/{user}/g, msg.author.username)
                    .replace(/{circle}/g, circleOfSharing.join("`, `"))
            );
        }
        if (listOfPresets.length >= 1) {
            const listHeaderTemplate = await ougi.text(msg, "spooky_listHeader");
            msg.channel.send(
                listHeaderTemplate
                    .replace(/{user}/g, msg.author.username)
                    .replace(/{list}/g, listOfPresets.join("`, `"))
            );
        }
    }

module.exports = async function (msg) {
    let spookyCake = msg.content.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim();
    let spookySlices = spookyCake.split(" ");
    let args = spookySlices.slice(2);

    let thisMessage = args.join(" ");
    let breakChocolate = thisMessage.split("::").slice(1);
    if (breakChocolate.length < 1) {
        msg.channel.send(await ougi.text({ msg, stringID: "spooky_needOneArg", values: { command: "ougi help embed" } }));
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

    if (msg.attachments) {
        msg.attachments.map((files) => attachmentsForEmbed.push(files.url));
    }

    let serverIcon = (msg.guild && msg.guild.iconURL) 
        ? (msg.guild.iconURL({ dynamic: true, size: 4096 }) || client.user.displayAvatarURL({ dynamic: true, size: 4096 }))
        : client.user.displayAvatarURL({ dynamic: true, size: 4096 });

    let spookyConstructor = new Discord.EmbedBuilder();
    for (let i = 0; i < breakChocolate.length; i++) {
        let material = breakChocolate[i].trim();
        if (material.startsWith("field")) {
            material = material.substring(5).trim();
            if (material.length > 1024) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_fieldLimit" }));
                return;
            }
            if (material.length < 1) {
                material = "\u200b";
            }
            if (fieldsArray.length >= 25) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_maxFields" }));
                return;
            }
            fieldsArray.push(material);
        }
        else if (material.startsWith("deletefield ")) {
            material = material.substring(12).trim();
            let idx = parseInt(material, 10);
            if (isNaN(idx)) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_deleteFieldIndex" }));
                return;
            }
            if (idx <= 1) idx = 1;
            fieldsArray[idx - 1] = "/DELETE/";
        }
        else if (material.startsWith("subtitle")) {
            material = material.substring(8).trim();
            if (material.length > 1024) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_subtitleLimit" }));
                return;
            }
            if (material.length < 1) {
                material = "\u200b";
            }
            if (fieldsTitles.length >= 25) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_maxSubtitles" }));
                return;
            }
            fieldsTitles.push(material);
        }
        else if (material.startsWith("deletesubtitle ")) {
            material = material.substring(15).trim();
            let idx = parseInt(material, 10);
            if (isNaN(idx)) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_deleteSubtitleIndex" }));
                return;
            }
            if (idx <= 1) idx = 1;
            fieldsTitles[idx - 1] = undefined;
        }
        else if (material.startsWith("title ")) {
            material = material.substring(6).trim();
            if (material.length < 1 || material.length > 256) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_titleLimit" }));
                return;
            }
            spookyConstructor.setTitle(material);
        }
        else if (material.startsWith("save ")) {
            material = material.substring(5).trim();
            if (material.length < 1 || material.length > 100) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_presetNameLimit" }));
                return;
            }
            breakChocolate.splice(i, 1);
            presetName = material;
            i--;
        }
        else if (material.startsWith("share ")) {
            material = material.substring(6).trim();
            if (material.startsWith("<@") && material.endsWith(">")) {
                let mentionedUser = material.slice(2, -1).replace("!", "");
                if (!client.users.cache.has(mentionedUser)) {
                    msg.channel.send(await ougi.text({ msg, stringID: "spooky_mentionShare" }));
                    return;
                }
                sharedWith.push(mentionedUser);
                breakChocolate.splice(i, 1);
                i--;
            }
            else {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_mentionShare" }));
                return;
            }
        }
        else if (material.startsWith("load ")) {
            material = material.substring(5).trim();
            if (material.length < 1 || material.length > 100) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_presetNameLimit" }));
                return;
            }
            let myLoad = ougi.db().loadEmbedPresets() || {};
            let aPreset = material + "::" + msg.author.id;
            if (Object.prototype.hasOwnProperty.call(myLoad, aPreset)) {
                let gonnaPull = myLoad[aPreset].slice().reverse();
                breakChocolate.splice(i, 1);
                for (let e = 0; e < gonnaPull.length; e++) {
                    breakChocolate.splice(i, 0, gonnaPull[e]);
                }
                i--;
            }
            else {
                msg.channel.send(await ougi.text({
                    msg,
                    stringID: "spooky_noSuchPreset",
                    values: { preset: material }
                }));
                return;
            }
        }
        else if (material.startsWith("list")) {
            let myLoad = ougi.db().loadEmbedPresets() || {};
            let aPreset = "::" + msg.author.id;
            let allPresets = Object.keys(myLoad);
            for (let e = 0; e < allPresets.length; e++) {
                if (allPresets[e].endsWith(aPreset) && !listOfPresets.includes(allPresets[e])) {
                    listOfPresets.push(allPresets[e].replace(aPreset, ""));
                }
            }
            if (listOfPresets.length < 1) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_noPresetsSaved" }));
                return;
            }
            breakChocolate.splice(i, 1);
            i--;
        }
        else if (material.startsWith("delete ")) {
            material = material.substring(7).trim();
            if (material.length < 1 || material.length > 100) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_presetNameLimit" }));
                return;
            }
            let aPreset = material + "::" + msg.author.id;
            ougi.db().deleteEmbedPreset(aPreset);
            breakChocolate.splice(i, 1);
            msg.channel.send(await ougi.text({
                msg,
                stringID: "spooky_deletedPreset",
                values: { preset: material }
            }));
            i--;
        }
        else if (material.startsWith("author ")) {
            material = material.substring(7).trim();
            if (material.length < 1 || material.length > 256) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_authorNameLimit" }));
                return;
            }
            if (material.startsWith("<@") && material.endsWith(">")) {
                let mentionedUser = material.slice(2, -1).replace("!", "");
                const u = client.users.cache.get(mentionedUser) ?? await client.users.fetch(mentionedUser).catch(() => null);
                if (!u) {
                    msg.channel.send(await ougi.text({ msg, stringID: "spooky_authorValidUser" }));
                    return;
                }
                authorArray[0] = u.username;
            }
            else {
                authorArray[0] = material;
            }
        }
        else if (material.startsWith("authorurl ")) {
            material = material.substring(10).trim();
            if (!material.includes(".")) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_authorUrlTld", values: { tldExamples: "`.com`, `.net`, `.boo`" } })).catch(console.error);
                return;
            }
            if (material.startsWith("http:")) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_authorUrlHttps", values: { protocol: "`https`" } })).catch(console.error);
                return;
            }
            if (!material.startsWith("https://")) {
                material = "https://" + material;
            }
            authorArray[2] = material;
        }
        else if (material.startsWith("description ") || material.startsWith("desc ")) {
            material = (material.startsWith("description ") ? material.substring(12) : material.substring(5)).trim();
            if (material.length < 1 || material.length > 2048) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_descriptionLimit" }));
                return;
            }
            spookyConstructor.setDescription(material);
        }
        else if (material.startsWith("footer ")) {
            material = material.substring(7).trim();
            if (material.length < 1 || material.length > 2048) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_footerLimit" }));
                return;
            }
            footerArray[0] = material + " | spookyEmbed by " + msg.author.username;
        }
        else if (material.startsWith("icon ")) {
            const authorAvatar = msg.author.displayAvatarURL({ dynamic: true, size: 4096 });
            const botAvatar = client.user.displayAvatarURL({ dynamic: true, size: 4096 });
            material = material.substring(5).trim().replace("guild", serverIcon).replace("ougi", botAvatar).replace("myself", authorAvatar);
            if (material.startsWith("<@") && material.endsWith(">")) {
                let mentionedUser = material.slice(2, -1).replace("!", "");
                const u = client.users.cache.get(mentionedUser) ?? await client.users.fetch(mentionedUser).catch(() => null);
                if (!u) {
                    msg.channel.send(await ougi.text({ msg, stringID: "spooky_footerIconRequirement", values: { guildOption: "`guild`", myselfOption: "`myself`", ougiOption: "`ougi`" } }));
                    return;
                }
                footerArray[1] = u.displayAvatarURL({ dynamic: true, size: 4096 });
            }
            else if (material.startsWith("file")) {
                if (attachmentsForEmbed.length < 1) {
                    msg.channel.send(await ougi.text({ msg, stringID: "spooky_noFilesAttached" }));
                    return;
                }
                let fIdx = parseInt(material.substring(4).trim(), 10) || 1;
                fIdx = Math.max(1, Math.min(fIdx, attachmentsForEmbed.length));
                footerArray[1] = attachmentsForEmbed[fIdx - 1];
            }
            else {
                footerArray[1] = material;
            }
        }
        else if (material.startsWith("avatar ")) {
            const authorAvatar = msg.author.displayAvatarURL({ dynamic: true, size: 4096 });
            const botAvatar = client.user.displayAvatarURL({ dynamic: true, size: 4096 });
            material = material.substring(7).trim().replace("guild", serverIcon).replace("ougi", botAvatar).replace("myself", authorAvatar);
            if (material.startsWith("<@") && material.endsWith(">")) {
                let mentionedUser = material.slice(2, -1).replace("!", "");
                const u = client.users.cache.get(mentionedUser) ?? await client.users.fetch(mentionedUser).catch(() => null);
                if (!u) {
                    msg.channel.send(await ougi.text({ msg, stringID: "spooky_avatarRequirement", values: { guildOption: "`guild`", myselfOption: "`myself`", ougiOption: "`ougi`" } }));
                    return;
                }
                authorArray[1] = u.displayAvatarURL({ dynamic: true, size: 4096 });
            }
            else if (material.startsWith("file")) {
                if (attachmentsForEmbed.length < 1) {
                    msg.channel.send(await ougi.text({ msg, stringID: "spooky_noFilesAttached" }));
                    return;
                }
                let fIdx = parseInt(material.substring(4).trim(), 10) || 1;
                fIdx = Math.max(1, Math.min(fIdx, attachmentsForEmbed.length));
                authorArray[1] = attachmentsForEmbed[fIdx - 1];
            }
            else {
                authorArray[1] = material;
            }
        }
        else if (material.startsWith("thumbnail ")) {
            const authorAvatar = msg.author.displayAvatarURL({ dynamic: true, size: 4096 });
            const botAvatar = client.user.displayAvatarURL({ dynamic: true, size: 4096 });
            material = material.substring(10).trim().replace("guild", serverIcon).replace("ougi", botAvatar).replace("myself", authorAvatar);
            if (material.startsWith("<@") && material.endsWith(">")) {
                let mentionedUser = material.slice(2, -1).replace("!", "");
                const u = client.users.cache.get(mentionedUser) ?? await client.users.fetch(mentionedUser).catch(() => null);
                if (!u) {
                    msg.channel.send(await ougi.text({ msg, stringID: "spooky_thumbnailRequirement", values: { guildOption: "`guild`", myselfOption: "`myself`", ougiOption: "`ougi`" } }));
                    return;
                }
                spookyConstructor.setThumbnail(u.displayAvatarURL({ dynamic: true, size: 4096 }));
            }
            else if (material.startsWith("file")) {
                if (attachmentsForEmbed.length < 1) {
                    msg.channel.send(await ougi.text({ msg, stringID: "spooky_noFilesAttached" }));
                    return;
                }
                let fIdx = parseInt(material.substring(4).trim(), 10) || 1;
                fIdx = Math.max(1, Math.min(fIdx, attachmentsForEmbed.length));
                spookyConstructor.setThumbnail(attachmentsForEmbed[fIdx - 1]);
            }
            else {
                spookyConstructor.setThumbnail(material);
            }
        }
        else if (material.startsWith("image ")) {
            const authorAvatar = msg.author.displayAvatarURL({ dynamic: true, size: 4096 });
            const botAvatar = client.user.displayAvatarURL({ dynamic: true, size: 4096 });
            material = material.substring(6).trim().replace("guild", serverIcon).replace("ougi", botAvatar).replace("myself", authorAvatar);
            if (material.startsWith("<@") && material.endsWith(">")) {
                let mentionedUser = material.slice(2, -1).replace("!", "");
                const u = client.users.cache.get(mentionedUser) ?? await client.users.fetch(mentionedUser).catch(() => null);
                if (!u) {
                    msg.channel.send(await ougi.text({ msg, stringID: "spooky_imageRequirement", values: { guildOption: "`guild`", myselfOption: "`myself`", ougiOption: "`ougi`" } }));
                    return;
                }
                spookyConstructor.setImage(u.displayAvatarURL({ dynamic: true, size: 4096 }));
            }
            else if (material.startsWith("file")) {
                if (attachmentsForEmbed.length < 1) {
                    msg.channel.send(await ougi.text({ msg, stringID: "spooky_noFilesAttached" }));
                    return;
                }
                let fIdx = parseInt(material.substring(4).trim(), 10) || 1;
                fIdx = Math.max(1, Math.min(fIdx, attachmentsForEmbed.length));
                spookyConstructor.setImage(attachmentsForEmbed[fIdx - 1]);
            }
            else {
                spookyConstructor.setImage(material);
            }
        }
        else if (material.startsWith("url ")) {
            material = material.substring(4).trim();
            if (!material.includes(".")) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_invalidUrl", values: { tldExamples: "`.com`, `.net`, `.boo`" } })).catch(console.error);
                return;
            }
            if (material.startsWith("http:")) {
                msg.channel.send(await ougi.text({ msg, stringID: "spooky_urlHttps", values: { protocol: "`https`" } })).catch(console.error);
                return;
            }
            if (!material.startsWith("https://")) {
                material = "https://" + material;
            }
            spookyConstructor.setURL(material);
        }
        else if (material.startsWith("timestamp")) {
            spookyConstructor.setTimestamp();
        }
        else if (material.startsWith("color ")) {
            material = material.substring(6).trim();
            if (material.startsWith("#") || /^[0-9A-Fa-f]{6}$/.test(material)) {
                spookyConstructor.setColor(material.startsWith("#") ? material : `#${material}`);
            } else {
                spookyConstructor.setColor("#230347");
            }
        }
        else {
            msg.channel.send(await ougi.text({ msg, stringID: "spooky_syntaxHelp", values: { command: "ougi help embed" } }));
            return;
        }
    }

    if (footerArray[0] !== undefined || footerArray[1] !== undefined) {
        spookyConstructor.setFooter({
            text: footerArray[0] || "\u200b",
            iconURL: footerArray[1] || undefined
        });
    }

    if (authorArray[0] !== undefined || authorArray[1] !== undefined || authorArray[2] !== undefined) {
        spookyConstructor.setAuthor({
            name: authorArray[0] || "\u200b",
            iconURL: authorArray[1] || undefined,
            url: authorArray[2] || undefined
        });
    }

    for (let i = 0; i < fieldsArray.length || i < fieldsTitles.length; i++) {
        if (fieldsArray[i] === "/DELETE/" || fieldsTitles[i] === "/DELETE/") {
            fieldsArray.splice(i, 1);
            fieldsTitles.splice(i, 1);
            i--;
        }
    }

    for (let i = 0; i < fieldsArray.length || i < fieldsTitles.length; i++) {
        if (fieldsArray[i] !== undefined || fieldsTitles[i] !== undefined) {
            spookyConstructor.addFields({
                name: fieldsTitles[i] || "\u200b",
                value: fieldsArray[i] || "\u200b"
            });
        }
    }

    if (breakChocolate.length >= 1) {
        msg.channel.send({ embeds: [spookyConstructor] }).then(() => {
            setTimeout(() => {
                if (msg.delete) msg.delete().catch(() => {});
            }, 2000);
        }).catch(async err => {
            console.error("Error sending spookyEmbed:", err);
            msg.channel.send(await ougi.text({ msg, stringID: "spooky_failedToSend" })).catch(console.error);
        });
    }

    if (presetName.length >= 1) {
        if (breakChocolate.length < 1) {
            msg.channel.send(await ougi.text({ msg, stringID: "spooky_embedEmpty" }));
            return;
        }
        let personalizedPresetName = presetName + "::" + msg.author.id;
        ougi.db().saveEmbedPreset(personalizedPresetName, breakChocolate);

        msg.channel.send(await ougi.text({
            msg,
            stringID: "spooky_savedPreset",
            values: {
                preset: presetName,
                commandOption: "`::load " + presetName + "`"
            }
        }));
    }

    if (sharedWith.length >= 1) {
        if (breakChocolate.length < 1) {
            msg.channel.send(await ougi.text({ msg, stringID: "spooky_embedEmpty" }));
            return;
        }
        let circleOfSharing = [];
        for (let i = 0; i < sharedWith.length; i++) {
            const u = client.users.cache.get(sharedWith[i]) ?? await client.users.fetch(sharedWith[i]).catch(() => null);
            if (u) {
                circleOfSharing.push(u.username);
                let everyPresetShare = msg.author.username + "'s preset::" + sharedWith[i];
                ougi.db().saveEmbedPreset(everyPresetShare, breakChocolate);
            }
        }

        msg.channel.send(await ougi.text({
            msg,
            stringID: "spooky_sharedPreset",
            values: {
                user: msg.author.username,
                circle: circleOfSharing.join("`, `"),
                commandOption: "`::load " + msg.author.username + "'s preset`"
            }
        }));
    }
    if (listOfPresets.length >= 1) {
        msg.channel.send(await ougi.text({
            msg,
            stringID: "spooky_listHeader",
            values: {
                user: msg.author.username,
                list: listOfPresets.join("`, `")
            }
        }));
    }
};

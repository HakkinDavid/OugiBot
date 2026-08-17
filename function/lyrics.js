const axios = require('axios');
const cheerio = require('cheerio');
const { EmbedBuilder } = require('discord.js');

module.exports = async function (arguments, msg) {
  const avatar = msg.client.user.displayAvatarURL({ dynamic: true, size: 4096 });
  let lyricsEmbed = new EmbedBuilder()
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
    .setAuthor({ name: "Ougi [BOT]", iconURL: avatar })
    .setColor("#230347")
    .setFooter({ text: await ougi.text({ msg, stringID: "lyrics_footer" }) || "Lyrics powered by Genius", iconURL: avatar });

  let searchQuery = Array.isArray(arguments) ? arguments.join(" ").trim() : "";

  if (!searchQuery) {
    const session = global.vc?.[msg.guildId] ?? ougi.voiceManager?.getSession(msg.guildId);
    if (!msg.guild || !session || !session.queue || !session.queue.length) {
      msg.channel.send(await ougi.text({ msg, stringID: "lyrics_nothingPlaying" }) || "Nothing is currently playing.").catch(console.error);
      return;
    }
    searchQuery = session.queue[0].title;
  }

  try {
    const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' };
    const searchUrl = `https://genius.com/api/search/multi?q=${encodeURIComponent(searchQuery)}`;
    const searchRes = await axios.get(searchUrl, { headers, timeout: 10_000 });
    const sections = searchRes.data?.response?.sections || [];
    const songSection = sections.find(s => s.type === 'song');
    const songHit = songSection?.hits?.[0]?.result;

    if (!songHit) {
      msg.channel.send(await ougi.text({ msg, stringID: "lyrics_notAvailable" }) || "Lyrics not found.").catch(console.error);
      return;
    }

    const songTitle = songHit.full_title;
    const songPageUrl = songHit.url;

    const pageRes = await axios.get(songPageUrl, { headers, timeout: 10_000 });
    const $ = cheerio.load(pageRes.data);
    $('br').replaceWith('\n');
    let lyrics = $('[data-lyrics-container="true"]').text().trim();
    if (!lyrics) {
      lyrics = $('[class^="Lyrics__Container"]').text().trim();
    }
    if (!lyrics) {
      lyrics = $('.lyrics').text().trim();
    }

    if (!lyrics) {
      msg.channel.send(await ougi.text({ msg, stringID: "lyrics_extractFail" }) || "Failed to extract lyrics.").catch(console.error);
      return;
    }

    lyricsEmbed.setTitle(songTitle.slice(0, 256));

    const paragraphs = lyrics.split(/(?=\[[^\]]+\])/);
    let fieldCount = 0;
    for (let i = 0; i < paragraphs.length && fieldCount < 25; i++) {
      const paragraph = paragraphs[i].trim();
      if (!paragraph) continue;
      lyricsEmbed.addFields({
        name: fieldCount === 0 ? "Lyrics" : "\u200b",
        value: paragraph.slice(0, 1024)
      });
      fieldCount++;
    }

    await msg.channel.send({ embeds: [lyricsEmbed] });
  } catch (e) {
    console.error("Error in lyricsCommand:", e);
    msg.channel.send("Lyrics aren't available right now.").catch(console.error);
  }
};

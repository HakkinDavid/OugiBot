const axios = require('axios');
const cheerio = require('cheerio');
const { EmbedBuilder } = require('discord.js');

module.exports = async function (arguments, msg) {
  let lyricsEmbed = new EmbedBuilder()
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
    .setAuthor({ name: "Ougi [BOT]", iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) })
    .setColor("#230347")
    .setFooter({ text: await ougi.text(msg, "lyrics_footer"), iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) });

  let searchQuery = arguments.join(" ");

  if (!searchQuery) {
    if (!msg.guild || !vc[msg.guildId] || !vc[msg.guildId].queue.length) {
      msg.channel.send(await ougi.text(msg, "lyrics_nothingPlaying")).catch(console.error);
      return;
    }
    searchQuery = vc[msg.guildId].queue[0].title;
  }

  try {
    const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' };
    const searchUrl = `https://genius.com/api/search/multi?q=${encodeURIComponent(searchQuery)}`;
    const searchRes = await axios.get(searchUrl, { headers });
    const sections = searchRes.data?.response?.sections || [];
    const songSection = sections.find(s => s.type === 'song');
    const songHit = songSection?.hits?.[0]?.result;

    if (!songHit) {
      msg.channel.send(await ougi.text(msg, "lyrics_notAvailable")).catch(console.error);
      return;
    }

    const songTitle = songHit.full_title;
    const songPageUrl = songHit.url;

    const pageRes = await axios.get(songPageUrl, { headers });
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
      msg.channel.send(await ougi.text(msg, "lyrics_extractFail")).catch(console.error);
      return;
    }

    lyricsEmbed.setTitle(songTitle);

    const paragraphs = lyrics.split(/(?=\[[^\]]+\])/);
    for (let i = 0; i < paragraphs.length && i < 25; i++) {
      const paragraph = paragraphs[i].trim();
      if (!paragraph) continue;
      lyricsEmbed.addFields({
        name: i === 0 ? "Lyrics" : "\u200b",
        value: paragraph.slice(0, 1024)
      });
    }

    await msg.channel.send({ embeds: [lyricsEmbed] });
  } catch (e) {
    console.error("Error in lyricsCommand:", e);
    msg.channel.send("Lyrics aren't available right now.").catch(console.error);
  }
};

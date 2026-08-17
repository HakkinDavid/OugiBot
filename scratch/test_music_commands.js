const path = require('path');
const assert = require('assert');

// Setup globals required by Ougi
require('dotenv').config();
global.Discord = require('discord.js');
global.fs = require('fs');
global.stringSimilarity = require('string-similarity');
global.path = require('node:path');
global.requireAll = require('require-all');
global.Voice = require('@discordjs/voice');
global.YouTube = require('youtube-sr').default;
global.youtubedl = require('youtube-dl-exec');

global.ougi = global.requireAll(path.join(__dirname, '../function'));

async function runTests() {
    console.log("=== Starting Music Commands & Radio Verification Tests ===");

    // Test 1: Duration parsing and progress bar
    console.log("\n[Test 1] Testing duration parser & progress bar...");
    const { parseDurationToSec, formatSecondsToTime, generateProgressBar } = ougi.voiceManager;
    assert.strictEqual(parseDurationToSec('03:45'), 225, "03:45 should be 225s");
    assert.strictEqual(parseDurationToSec('01:23:45'), 5025, "01:23:45 should be 5025s");
    assert.strictEqual(parseDurationToSec('45'), 45, "45 should be 45s");
    assert.strictEqual(parseDurationToSec('Live'), 0, "Live should be 0s");
    assert.strictEqual(formatSecondsToTime(225), '03:45', "225s should format to 03:45");
    assert.strictEqual(formatSecondsToTime(5025), '01:23:45', "5025s should format to 01:23:45");

    const bar1 = generateProgressBar(60, 180, 15);
    console.log("Generated Progress Bar (60s/180s):", bar1);
    assert(bar1.includes('🔘'), "Progress bar should include button icon");
    assert(bar1.includes('01:00 / 03:00'), "Progress bar should include formatted timestamps");
    console.log("✓ Test 1 passed!");

    // Test 2: AudioCacheManager methods & metadata
    console.log("\n[Test 2] Testing AudioCacheManager methods...");
    const videoId = "HPOKr-Wyscw";
    ougi.audioCacheManager.saveMetadata(videoId, {
        title: "Decent Black - Ougi Oshino",
        duration: "04:36",
        thumbnail: "https://example.com/thumb.jpg",
        url: `https://www.youtube.com/watch?v=${videoId}`
    });
    const meta = ougi.audioCacheManager.getMetadata(videoId);
    assert.strictEqual(meta.title, "Decent Black - Ougi Oshino");
    assert.strictEqual(meta.duration, "04:36");

    const seeds = ougi.audioCacheManager.getRadioSeeds();
    assert(seeds.length >= 10, "Should have at least 10 curated radio seeds");
    console.log(`✓ AudioCacheManager has ${seeds.length} radio seeds`);
    console.log("✓ Test 2 passed!");

    // Test 3: VoiceManager Session, Queue, Pause, Resume, NP, Remove
    console.log("\n[Test 3] Testing VoiceManager session management & commands...");
    const mockGuildId = "test_guild_12345";
    if (!global.vc) global.vc = {};
    global.vc[mockGuildId] = {
        queue: [
            { title: "Decent Black", url: "https://www.youtube.com/watch?v=111", duration: "04:36", durationSec: 276, startTime: Date.now() - 30000, totalPausedMs: 0, pausedAt: null },
            { title: "Mathemagics", url: "https://www.youtube.com/watch?v=222", duration: "04:04", durationSec: 244 },
            { title: "Dark Cherry Mystery", url: "https://www.youtube.com/watch?v=333", duration: "04:18", durationSec: 258 },
            { title: "Renai Circulation", url: "https://www.youtube.com/watch?v=444", duration: "04:12", durationSec: 252 }
        ],
        ttsQueue: [],
        isLooping: false,
        isRadio: false,
        isPaused: false,
        pausedAt: null,
        totalPausedMs: 0,
        isCachedPlaying: false
    };

    // Test 3a: Now Playing
    const npInfo = ougi.voiceManager.getNowPlaying(mockGuildId);
    assert.strictEqual(npInfo.song.title, "Decent Black");
    assert.strictEqual(npInfo.totalQueueLength, 4);
    assert.strictEqual(npInfo.nextSong.title, "Mathemagics");
    console.log("✓ Now Playing output:", npInfo.song.title, "| Progress:", npInfo.progressBar);

    // Test 3b: Pause
    const pauseRes = ougi.voiceManager.pauseMusic(mockGuildId);
    assert.strictEqual(pauseRes.success, true);
    assert.strictEqual(global.vc[mockGuildId].isPaused, true);
    const pauseAgain = ougi.voiceManager.pauseMusic(mockGuildId);
    assert.strictEqual(pauseAgain.reason, 'ALREADY_PAUSED');
    console.log("✓ Pause functionality verified");

    // Test 3c: Resume
    const resumeRes = ougi.voiceManager.resumeMusic(mockGuildId);
    assert.strictEqual(resumeRes.success, true);
    assert.strictEqual(global.vc[mockGuildId].isPaused, false);
    const resumeAgain = ougi.voiceManager.resumeMusic(mockGuildId);
    assert.strictEqual(resumeAgain.reason, 'NOT_PAUSED');
    console.log("✓ Resume functionality verified");

    // Test 3d: Remove by position (1-based index)
    const removePosRes = ougi.voiceManager.removeSong(mockGuildId, "2", {}, {});
    assert.strictEqual(removePosRes.success, true);
    assert.strictEqual(removePosRes.removedSong.title, "Mathemagics");
    assert.strictEqual(global.vc[mockGuildId].queue.length, 3);
    console.log("✓ Remove by index verified (removed Mathemagics)");

    // Test 3e: Remove by search title
    const removeTitleRes = ougi.voiceManager.removeSong(mockGuildId, "renai", {}, {});
    assert.strictEqual(removeTitleRes.success, true);
    assert.strictEqual(removeTitleRes.removedSong.title, "Renai Circulation");
    assert.strictEqual(global.vc[mockGuildId].queue.length, 2);
    console.log("✓ Remove by fuzzy title verified (removed Renai Circulation)");

    // Test 3f: Remove not found
    const removeFailRes = ougi.voiceManager.removeSong(mockGuildId, "non_existent_song", {}, {});
    assert.strictEqual(removeFailRes.success, false);
    assert.strictEqual(removeFailRes.reason, 'NOT_FOUND');
    console.log("✓ Remove error handling verified");

    // Test 3g: Radio queue replenishment
    global.vc[mockGuildId].isRadio = true;
    global.vc[mockGuildId].queue = [];
    await ougi.voiceManager.replenishRadioQueue(mockGuildId, 3);
    assert(global.vc[mockGuildId].queue.length === 3, "Radio queue should be replenished to 3 songs");
    console.log("✓ Radio queue replenished with:", global.vc[mockGuildId].queue.map(s => s.title));

    // Cleanup mock
    ougi.voiceManager.cleanup(mockGuildId);
    assert.strictEqual(global.vc[mockGuildId], undefined);
    console.log("✓ VoiceManager cleanup verified");
    console.log("✓ Test 3 passed!");

    // Test 4: Localization strings verification
    console.log("\n[Test 4] Verifying all music localization strings in English...");
    const keysToTest = [
        { stringID: "music_pausedTitle" },
        { stringID: "music_pausedDesc", values: { title: "Song A", url: "https://yt.com", command: "ougi resume" } },
        { stringID: "music_resumedTitle" },
        { stringID: "music_resumedDesc", values: { title: "Song A", url: "https://yt.com" } },
        { stringID: "music_nowPlayingTitle" },
        { stringID: "music_nothingPlaying", values: { playCmd: "ougi play <song>", radioCmd: "ougi radio" } },
        { stringID: "music_removedTitle" },
        { stringID: "music_removedDesc", values: { title: "Song A", url: "https://yt.com", position: 2, remaining: 3 } },
        { stringID: "music_radioTitle" },
        { stringID: "music_radioDesc", values: { count: 12 } },
        { stringID: "music_radioFooter" },
        { stringID: "music_queuePage", values: { page: 1, pages: 3 } },
        { stringID: "pauseHelpDesc" },
        { stringID: "resumeHelpDesc" },
        { stringID: "queueHelpDesc" },
        { stringID: "npHelpDesc" },
        { stringID: "radioHelpDesc" },
        { stringID: "musicRemoveHelpDesc" },
        { stringID: "stopHelpDesc" }
    ];

    for (const item of keysToTest) {
        const text = await ougi.text({ lang: 'en', stringID: item.stringID, values: item.values });
        assert(text && typeof text === 'string' && text !== 'undeclaredString', `Key ${item.stringID} should resolve properly`);
        console.log(`  ✓ [${item.stringID}]: "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"`);
    }
    console.log("✓ Test 4 passed!");

    // Test 5: Command list registry validation
    console.log("\n[Test 5] Validating CommandList registry & Help mapping...");
    const names = ougi.commandList.getNames();
    const requiredCommands = ['music', 'skip', 'stop', 'pause', 'resume', 'queue', 'np', 'remove', 'radio'];
    for (const cmd of requiredCommands) {
        assert(names.includes(cmd), `CommandList should register '${cmd}'`);
    }
    console.log("✓ All required music commands registered in CommandList registry:", requiredCommands.join(', '));
    console.log("✓ Test 5 passed!");

    console.log("\n=======================================================");
    console.log("🎉 ALL MUSIC COMMANDS & RADIO TESTS PASSED SUCCESSFULLY!");
    console.log("=======================================================");
}

runTests().catch(err => {
    console.error("❌ Test failed with error:", err);
    process.exit(1);
});

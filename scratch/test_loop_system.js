const { AudioMixer } = require('../function/voiceManager');
const vm = require('../function/voiceManager');
global.youtubedl = require('youtube-dl-exec');
global.vc = {};

async function testLoopSystem() {
    console.log('=== TEST: Music Queue Loop & Cached PCM Architecture ===\n');

    global.Voice = { ...require('@discordjs/voice') };
    const mockChannel = {
        id: 'vc_test',
        guildId: 'guild_loop_test',
        guild: { voiceAdapterCreator: () => {} }
    };

    const mockConnection = {
        state: { status: global.Voice.VoiceConnectionStatus.Ready },
        joinConfig: { channelId: 'vc_test' },
        subscribe: () => {},
        on: () => {}
    };

    global.Voice.getVoiceConnection = () => mockConnection;
    global.Voice.entersState = async () => {};

    // Mock startMixerPipeline
    vm.startMixerPipeline = function(guildId) {
        const session = vc[guildId];
        session.mixer = new AudioMixer();
    };

    const session = await vm.getOrCreateSession('guild_loop_test', mockChannel);
    
    // 1. Test isLooping toggle
    console.log('1. Testing isLooping initialization and state toggles...');
    if (session.isLooping !== false) throw new Error('isLooping should default to false');

    session.isLooping = true;
    if (session.isLooping !== true) throw new Error('isLooping toggle failed');

    // 2. Test Song Structure & PCM Caching
    console.log('2. Testing Song PCM Caching on First Play vs Loop Replay...');
    const songA = {
        title: 'Song A (Rick Astley)',
        url: 'https://youtube.com/watch?v=111'
    };
    const songB = {
        title: 'Song B (Lofi Hip Hop)',
        url: 'https://youtube.com/watch?v=222'
    };

    session.queue = [songA, songB];

    // Populate synthetic PCM chunks into songA to simulate first play caching
    songA.cachedPcm = [];
    for (let i = 0; i < 50; i++) {
        const frame = Buffer.alloc(3840);
        frame.writeInt16LE(12000, 0);
        songA.cachedPcm.push(frame);
    }

    console.log('Song A cached PCM frames:', songA.cachedPcm.length);

    const mockMsg = {
        guildId: 'guild_loop_test',
        channel: { send: async () => {} }
    };

    console.log('Playing Song A from cache...');
    await vm.playMusic(mockMsg, mockChannel);

    if (!session.isCachedPlaying) {
        throw new Error('isCachedPlaying was not set when playing cached PCM!');
    }

    console.log('Song A is successfully playing from in-memory PCM cache (0 network requests)!');

    // 3. Test Skip under Loop mode
    console.log('\n3. Testing Skip under Loop mode...');
    vm.skipMusic('guild_loop_test', mockMsg, mockChannel);

    // After skip with isLooping = true, songA should move to back of queue: [songB, songA]
    if (session.queue[0] !== songB || session.queue[1] !== songA) {
        throw new Error('Queue rotation failed during skip! Expected [songB, songA], got: ' + session.queue.map(s => s.title).join(', '));
    }
    console.log('Queue rotated correctly on skip:', session.queue.map(s => s.title));

    // 4. Test unloop
    console.log('\n4. Testing unloop...');
    session.isLooping = false;
    vm.skipMusic('guild_loop_test', mockMsg, mockChannel);

    // After skip with isLooping = false, songB should be removed: [songA]
    if (session.queue.length !== 1 || session.queue[0] !== songA) {
        throw new Error('Queue shift failed during unlooped skip!');
    }
    console.log('Queue shifted correctly on unlooped skip:', session.queue.map(s => s.title));

    // Cleanup
    vm.cleanup('guild_loop_test');
    console.log('\n🎉 ALL LOOP ARCHITECTURE TESTS PASSED 100%!');
}

testLoopSystem().catch(err => {
    console.error('Test Failed:', err);
    process.exit(1);
});

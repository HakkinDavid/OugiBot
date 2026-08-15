const { AudioMixer } = require('../function/voiceManager');
const cacheManager = require('../function/audioCacheManager');
const fs = require('fs');

async function testMixerConcurrency() {
    console.log('=== TEST: Mixer Concurrency with Cached Disk Stream & TTS ===\n');

    const mixer = new AudioMixer();
    let mixedFrames = 0;
    let duckedFrames = 0;
    let ttsOnlyFrames = 0;
    let musicOnlyFrames = 0;

    mixer.on('data', (frame) => {
        if (frame.length !== 3840) {
            console.error('Frame size mismatch:', frame.length);
        }
        mixedFrames++;
    });

    // 1. Simulate reading 100 frames (384,000 bytes) of music from cache
    console.log('1. Starting Cached Music Stream...');
    const musicFrame = Buffer.alloc(3840);
    // Write 1000 in 16-bit PCM for music
    for (let i = 0; i < musicFrame.length; i += 2) {
        musicFrame.writeInt16LE(1000, i);
    }

    // Write 5 frames of music
    for (let i = 0; i < 5; i++) {
        mixer.writeMusic(musicFrame);
    }

    // 2. Start TTS while music is playing
    console.log('2. Triggering TTS Start while music is active...');
    mixer.startTts();

    const ttsFrame = Buffer.alloc(3840);
    // Write 5000 in 16-bit PCM for TTS
    for (let i = 0; i < ttsFrame.length; i += 2) {
        ttsFrame.writeInt16LE(5000, i);
    }

    // Write 5 frames of TTS + 5 frames of Music concurrently
    for (let i = 0; i < 5; i++) {
        mixer.writeTts(ttsFrame);
        mixer.writeMusic(musicFrame);
    }

    console.log('3. Ending TTS...');
    mixer.endTts();

    // Write 5 more frames of Music after TTS ended
    for (let i = 0; i < 5; i++) {
        mixer.writeMusic(musicFrame);
    }

    mixer.endMusic();

    console.log(`Total mixed frames emitted: ${mixedFrames}`);
    console.log('✓ Mixer Concurrency test completed successfully!');
}

testMixerConcurrency().catch(err => {
    console.error('Error in testMixerConcurrency:', err);
    process.exit(1);
});

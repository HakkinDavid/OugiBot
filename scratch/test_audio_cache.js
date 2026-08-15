const path = require('path');
const fs = require('fs');
const cacheManager = require('../function/audioCacheManager');

async function testAudioCache() {
    console.log('=== TEST: Global Shared LRU Audio Cache & Prefetcher ===\n');

    // 1. Video ID extraction
    console.log('1. Testing Video ID Extraction...');
    const testUrls = [
        { in: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', expected: 'dQw4w9WgXcQ' },
        { in: 'https://youtu.be/2hiKeIUJtos', expected: '2hiKeIUJtos' },
        { in: 'https://www.youtube.com/watch?v=7qZugJCf2eI&feature=youtu.be', expected: '7qZugJCf2eI' },
        { in: 'dQw4w9WgXcQ', expected: 'dQw4w9WgXcQ' }
    ];

    for (const t of testUrls) {
        const out = cacheManager.extractVideoId(t.in);
        if (out !== t.expected) {
            throw new Error(`Video ID extraction mismatch! Input: ${t.in}, Expected: ${t.expected}, Got: ${out}`);
        }
    }
    console.log('✓ Video ID Extraction passed for all URL variations.');

    // 2. Cache Write and Read
    console.log('\n2. Testing Cache Write Stream & Read Stream...');
    const testId = 'test_pcm_track_123';
    const fakePcmData = Buffer.alloc(3840 * 10, 0x42); // 10 frames = 38400 bytes

    const writer = cacheManager.createCacheWriteStream(testId);
    writer.write(fakePcmData);
    writer.end();

    // Wait a brief tick for file rename
    await new Promise(r => setTimeout(r, 200));

    if (!cacheManager.has(testId)) {
        throw new Error(`Track ${testId} was not found in cache after write!`);
    }

    const entry = cacheManager.get(testId);
    console.log(`✓ Track ${testId} cached successfully: ${entry.sizeBytes} bytes at ${entry.filePath}`);

    if (entry.sizeBytes !== 38400) {
        throw new Error(`Cached file size mismatch! Expected 38400, got ${entry.sizeBytes}`);
    }

    // Read back stream
    const readStream = cacheManager.createReadStream(testId);
    let bytesRead = 0;
    for await (const chunk of readStream) {
        bytesRead += chunk.length;
    }

    if (bytesRead !== 38400) {
        throw new Error(`ReadStream size mismatch! Expected 38400, got ${bytesRead}`);
    }
    console.log(`✓ ReadStream read back all ${bytesRead} bytes successfully with zero loss.`);

    // 3. Testing LRU Eviction
    console.log('\n3. Testing LRU Eviction with low maxSizeBytes limit...');
    const originalMax = cacheManager.maxSizeBytes;
    cacheManager.maxSizeBytes = 50000; // 50 KB limit

    // Write a second track to trigger eviction of testId
    const testId2 = 'test_pcm_track_456';
    const writer2 = cacheManager.createCacheWriteStream(testId2);
    writer2.write(Buffer.alloc(3840 * 8, 0x43)); // 30720 bytes (total would be 38400 + 30720 = 69120 > 50000)
    writer2.end();

    await new Promise(r => setTimeout(r, 200));

    // testId should be evicted, testId2 should be retained
    if (cacheManager.has(testId)) {
        throw new Error(`Oldest track ${testId} should have been evicted by LRU!`);
    }
    if (!cacheManager.has(testId2)) {
        throw new Error(`New track ${testId2} should be retained in cache!`);
    }
    console.log('✓ LRU eviction successfully purged oldest track and preserved newest track.');

    // Cleanup test files
    cacheManager.maxSizeBytes = originalMax;
    try {
        const file2 = path.join(cacheManager.cacheDir, `${testId2}.pcm`);
        if (fs.existsSync(file2)) fs.unlinkSync(file2);
        cacheManager.cacheMap.delete(testId2);
    } catch (_) {}

    console.log('\n🎉 ALL AUDIO CACHE MANAGER UNIT TESTS PASSED 100%!');
}

testAudioCache().catch(err => {
    console.error('Test Error:', err);
    process.exit(1);
});

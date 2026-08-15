const fs = require('fs');
const path = require('path');
const cacheManager = require('../function/audioCacheManager');

async function testIncompleteTempCleanup() {
    console.log('=== TEST: Incomplete Temp File Cleanup on Interrupted Stream ===\n');

    const testId = 'interrupted_track_999';

    // 1. Create a write stream (generates .temp file)
    console.log('1. Starting a mock write stream...');
    const writer = cacheManager.createCacheWriteStream(testId);
    
    // Write 5KB of partial data
    writer.write(Buffer.alloc(5120, 0x55));

    await new Promise(r => setTimeout(r, 100));

    // Verify .temp file exists
    const filesAfterStart = fs.readdirSync(cacheManager.cacheDir);
    const tempFileFound = filesAfterStart.find(f => f.startsWith(testId) && f.endsWith('.temp'));

    if (!tempFileFound) {
        throw new Error('Temp file was not created on stream start!');
    }
    console.log(`✓ Temp file found during download: ${tempFileFound}`);

    // 2. Abort stream mid-way (simulating user ougi skip or ougi stop)
    console.log('\n2. Aborting stream (simulating skip / stop / network abort)...');
    writer.abort();

    await new Promise(r => setTimeout(r, 100));

    // Verify .temp file is immediately removed and no .pcm was registered
    const filesAfterAbort = fs.readdirSync(cacheManager.cacheDir);
    const tempFileStillExists = filesAfterAbort.find(f => f.startsWith(testId));

    if (tempFileStillExists) {
        throw new Error(`Incomplete file ${tempFileStillExists} was NOT cleaned up after abort!`);
    }

    if (cacheManager.has(testId)) {
        throw new Error(`Track ${testId} should NOT be in cache index after abort!`);
    }

    console.log('✓ Incomplete temp file was deleted immediately on abort.');
    console.log('✓ Cache index remained clean without corrupt entries.');

    console.log('\n🎉 ALL INCOMPLETE CLEANUP TESTS PASSED 100%!');
}

testIncompleteTempCleanup().catch(err => {
    console.error('Test Failed:', err);
    process.exit(1);
});

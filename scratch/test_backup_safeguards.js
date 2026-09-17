const assert = require('assert');
const path = require('path');
const fs = require('fs');
const requireAll = require('require-all');

global.channels = {
    backup: "726927738094485534",
    fileSpace: "726929586339840072",
    reminders: "726929651573981225",
    embeds: "740187317238497340",
    news: "751697345737129994",
    neuro: "759983614128947250",
    settings: "791151086077083688",
    locales: "1538681641076007022",
    dynamicLocales: "880322518139957299",
    raffles: "1411177261172002906",
    economy: "1536866624253075527",
    cookies: "1537325636945846273",
    feeds: "1545954243020587008"
};

global.ougi = requireAll(path.join(__dirname, '../function'));

async function testSafeguards() {
    console.log("==========================================");
    console.log("🧪 Testing Backup Modification Safeguards");
    console.log("==========================================");

    const db = ougi.db();
    db.unloadAll();

    // 1. Test initHashes populates cookies.txt and all databases
    console.log("\n[TEST 1] Testing initHashes() baseline registration...");
    db.initHashes();
    assert(db.fileHashes['cookies'], "cookies.txt hash was not registered in fileHashes!");
    assert(db.fileHashes['settings'], "settings.db hash was not registered in fileHashes!");
    assert(db.fileHashes['responses'], "responses.db hash was not registered in fileHashes!");
    console.log("  ✅ Baseline hashes registered:", Object.keys(db.fileHashes).join(', '));

    // 2. Test unmodified cookies.txt returns false
    console.log("\n[TEST 2] Testing hasFileChanged for unmodified cookies.txt...");
    const cookiesChangedPath = db.hasFileChanged('./cookies.txt');
    const cookiesChangedBare = db.hasFileChanged('cookies');
    assert.strictEqual(cookiesChangedPath, false, "hasFileChanged('./cookies.txt') returned true for unmodified file!");
    assert.strictEqual(cookiesChangedBare, false, "hasFileChanged('cookies') returned true for unmodified file!");
    console.log("  ✅ Unmodified cookies.txt correctly reports hasFileChanged = false.");

    // 3. Test unmodified backup skip in ougi.backup
    console.log("\n[TEST 3] Testing ougi.backup skip for unmodified cookies.txt...");
    const skipResult = await ougi.backup('./cookies.txt', 'nonexistent_channel_id');
    assert.strictEqual(skipResult, true, "ougi.backup should have skipped and returned true without uploading");
    console.log("  ✅ ougi.backup safely skipped upload for unchanged cookies.txt.");

    // 4. Test literal modification of a test file
    console.log("\n[TEST 4] Testing literal change detection...");
    const testFile = path.join(__dirname, 'test_dummy.txt');
    fs.writeFileSync(testFile, "Initial content 123", 'utf-8');
    try {
        db.recordFileHash(testFile);
        assert.strictEqual(db.hasFileChanged(testFile), false, "Freshly hashed test file should report false");

        // Literal change
        fs.writeFileSync(testFile, "Modified content 456", 'utf-8');
        assert.strictEqual(db.hasFileChanged(testFile), true, "Modified test file must report true");

        // Record hash simulates backup upload completion
        db.recordFileHash(testFile);
        assert.strictEqual(db.hasFileChanged(testFile), false, "After recording new hash, must report false");
        console.log("  ✅ Literal file modification accurately detected and reset upon recording hash.");
    } finally {
        if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
    }

    // 5. Test SQLite modification detection
    console.log("\n[TEST 5] Testing SQLite DB literal change detection...");
    assert.strictEqual(db.hasFileChanged('./settings.db'), false, "Clean settings.db should report false");
    // Modify setting
    db.saveKV('settings', 'kv', 'safeguard_test_key', Date.now().toString());
    db.checkpointAll();
    assert.strictEqual(db.hasFileChanged('./settings.db'), true, "Modified settings.db must report true after checkpoint");
    db.recordFileHash('./settings.db');
    assert.strictEqual(db.hasFileChanged('./settings.db'), false, "After hash record, settings.db must report false");

    // Clean up test key
    db.getDb('settings').prepare("DELETE FROM kv WHERE key = 'safeguard_test_key'").run();
    db.checkpointAll();
    db.recordFileHash('./settings.db');
    console.log("  ✅ SQLite modifications accurately detected and cleared.");

    // 6. Test canonical key resolution
    console.log("\n[TEST 6] Testing getCanonicalKey consistency...");
    assert.strictEqual(db.getCanonicalKey('./cookies.txt'), 'cookies');
    assert.strictEqual(db.getCanonicalKey('cookies.txt'), 'cookies');
    assert.strictEqual(db.getCanonicalKey('cookies'), 'cookies');
    assert.strictEqual(db.getCanonicalKey('./responses.db'), 'responses');
    assert.strictEqual(db.getCanonicalKey('responses'), 'responses');
    assert.strictEqual(db.getCanonicalKey('backup'), 'responses');
    assert.strictEqual(db.getCanonicalKey('./settings.db'), 'settings');
    console.log("  ✅ Canonical key mappings unified across all permutations.");

    // 7. Test dirty flags clearing when unchanged
    console.log("\n[TEST 7] Testing dirty flag normalization...");
    db.markDirty('cookies');
    assert.strictEqual(db.isDirty('./cookies.txt'), true, "isDirty should recognize canonical key");
    db.clearDirty('./cookies.txt');
    assert.strictEqual(db.isDirty('cookies'), false, "clearDirty should clear canonical key");
    console.log("  ✅ Dirty flag canonicalization verified.");

    console.log("\n==========================================");
    console.log("🎉 ALL SAFEGUARD TESTS PASSED SUCCESSFULLY!");
    console.log("==========================================");
}

testSafeguards().catch(err => {
    console.error("❌ Safeguard Test Suite Failed:", err);
    process.exit(1);
});

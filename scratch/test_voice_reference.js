const assert = require('assert');

// Setup mock environment
global.ougi = {
  db: () => ({
    getLang: (id) => (id === 'user_es' ? 'es' : null)
  }),
  langCodes: {
    es: 'Spanish',
    en: 'English',
    ja: 'Japanese'
  },
  text: async (msg, key) => `[text:${key}]`,
  voiceManager: {
    playTts: async (msg, vcChannel, ttsUrls) => {
      voiceManagerCalls.push({ msg, vcChannel, ttsUrls });
    }
  }
};

global.googleTTS = {
  getAllAudioUrls: (text, options) => {
    ttsGenerationCalls.push({ text, options });
    return [{ url: 'https://tts.example.com/audio.mp3' }];
  }
};

const voice = require('../function/voice.js');

let voiceManagerCalls = [];
let ttsGenerationCalls = [];

async function runTests() {
  console.log("Running voice.js tests...");

  // Test 1: Direct sentence
  voiceManagerCalls = [];
  ttsGenerationCalls = [];
  const mockMsg1 = {
    guild: { id: 'g1' },
    guildId: 'g1',
    member: {
      voice: {
        channel: {
          permissionsFor: () => ({ has: () => true })
        }
      }
    },
    client: { user: { id: 'bot1' } },
    content: "ougi speak hello world",
    channel: { send: async (txt) => console.log("send:", txt) }
  };
  await voice(mockMsg1);
  assert.strictEqual(ttsGenerationCalls.length, 1);
  assert.strictEqual(ttsGenerationCalls[0].text, "hello world");
  assert.strictEqual(ttsGenerationCalls[0].options.lang, "en");
  console.log("✓ Test 1 passed: Direct sentence");

  // Test 2: Language code flag
  voiceManagerCalls = [];
  ttsGenerationCalls = [];
  const mockMsg2 = {
    ...mockMsg1,
    content: "ougi speak ::ja konnichiwa"
  };
  await voice(mockMsg2);
  assert.strictEqual(ttsGenerationCalls.length, 1);
  assert.strictEqual(ttsGenerationCalls[0].text, "konnichiwa");
  assert.strictEqual(ttsGenerationCalls[0].options.lang, "ja");
  console.log("✓ Test 2 passed: Language code flag");

  // Test 3: Referenced message (reply)
  voiceManagerCalls = [];
  ttsGenerationCalls = [];
  const mockMsg3 = {
    ...mockMsg1,
    content: "ougi speak",
    reference: { messageId: "msg_123" },
    channel: {
      ...mockMsg1.channel,
      messages: {
        fetch: async (id) => {
          assert.strictEqual(id, "msg_123");
          return { content: "This is a referenced message content!" };
        }
      }
    }
  };
  await voice(mockMsg3);
  assert.strictEqual(ttsGenerationCalls.length, 1);
  assert.strictEqual(ttsGenerationCalls[0].text, "This is a referenced message content!");
  console.log("✓ Test 3 passed: Referenced message (reply)");

  // Test 4: Referenced message with language code flag
  voiceManagerCalls = [];
  ttsGenerationCalls = [];
  const mockMsg4 = {
    ...mockMsg3,
    content: "ougi speak ::es"
  };
  await voice(mockMsg4);
  assert.strictEqual(ttsGenerationCalls.length, 1);
  assert.strictEqual(ttsGenerationCalls[0].text, "This is a referenced message content!");
  assert.strictEqual(ttsGenerationCalls[0].options.lang, "es");
  console.log("✓ Test 4 passed: Referenced message with language code flag");

  // Test 5: Shortcut mockup (fan.js reaction shortcut format)
  voiceManagerCalls = [];
  ttsGenerationCalls = [];
  const shortcutUser = { id: 'user_es', username: 'Tester' };
  const memberMap = new Map();
  memberMap.set('user_es', {
    voice: {
      channel: {
        permissionsFor: () => ({ has: () => true })
      }
    }
  });

  const mockShortcutMsg = {
    id: 0,
    content: "ougi speak",
    author: shortcutUser,
    channelId: "msg_target",
    guildId: "g1",
    guild: {
      id: "g1",
      members: {
        cache: memberMap
      }
    },
    reference: { messageId: "msg_target", guildId: "g1", channelId: "c1" },
    isReactionShortcut: true,
    client: { user: { id: 'bot1' } },
    channel: {
      send: async (txt) => console.log("send:", txt),
      messages: {
        fetch: async (id) => {
          assert.strictEqual(id, "msg_target");
          return { content: "Shortcut TTS target text" };
        }
      }
    }
  };

  await voice(mockShortcutMsg);
  assert.strictEqual(ttsGenerationCalls.length, 1);
  assert.strictEqual(ttsGenerationCalls[0].text, "Shortcut TTS target text");
  assert.strictEqual(ttsGenerationCalls[0].options.lang, "es"); // fetched from user preference
  assert.strictEqual(voiceManagerCalls.length, 1);
  console.log("✓ Test 5 passed: Shortcut mockup");

  console.log("\nAll voice.js tests passed successfully!");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});

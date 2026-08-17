module.exports = async function (msg) {
  if (msg && msg.author && msg.author.id !== davidUserID) {
    return;
  }
  try {
    if (global.client) client.destroy();
  } catch (_) {}
  process.exit(0);
};

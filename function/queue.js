module.exports = async function (msg, vcChannel) {
    if (!msg) return;
    const clonedMsg = Object.create(msg);
    clonedMsg.content = `ougi queue`;
    return ougi.voiceCallMusic(clonedMsg);
};

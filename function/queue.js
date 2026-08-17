module.exports = async function (msg, vcChannel) {
    if (!msg) return;
    const clonedMsg = { ...msg };
    if (!clonedMsg.content || !clonedMsg.content.includes("queue")) {
        clonedMsg.content = `ougi queue`;
    }
    return ougi.voiceCallMusic(clonedMsg);
};

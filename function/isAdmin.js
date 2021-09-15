module.exports =

async function (msg) {
    let missing = await msg.member.permissionsIn(msg.channel).missing(['ADMINISTRATOR']);
    if (missing.length === 0) {
        return true
    }
    else {
        return false;
    }
}
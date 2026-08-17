const fs = require('fs');
const responses = (typeof global.ougi !== 'undefined' ? ougi.db().loadKnowledgeBase() : {});
const links = [];

for (const trigger in responses) {
    if (Object.prototype.hasOwnProperty.call(responses, trigger)) {
        for (let i = 0; i < responses[trigger].length; i++) {
            const response = responses[trigger][i];
            const potentialLinks = response.match(/https?:\/\/[^ ]+/gi) || [];
            if (potentialLinks.length > 0) {
                links.push({
                    trigger,
                    response,
                    links: potentialLinks.join("\n")
                });
            }
        }
    }
}

fs.writeFileSync('./linksInReplies.txt', JSON.stringify(links, null, 4));
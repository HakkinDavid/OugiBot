const fs = require('fs');
let responses = JSON.parse(fs.readFileSync('./responses.txt', 'utf-8'));
let links = [];

for (trigger in responses) {
    for (i=0; i < responses[trigger].length; i++) {
        let response = responses[trigger][i];
        let potentialLinks = response.match(/https{0,1}:\/\/[^ ]+/gi) || [];
        if (potentialLinks.length > 0) {
            links.push({
                trigger,
                response,
                links: potentialLinks.join("\n")
            });
        }
    }
}

fs.writeFileSync('./linksInReplies.txt', JSON.stringify(links, null, 4));
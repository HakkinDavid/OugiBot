module.exports =

async function generateText(input = []) {
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: input,
        seed: 100 * Math.random() + 1,
        model: 'openai',
        jsonMode: true
      })
    });
  
    const data = await response.json();

    let spookyReply = "";

    for (str in data) {
        if (typeof data[str] === 'string') {
            spookyReply = spookyReply + "\n" + data[str];
        }
        else if (typeof data[str] === 'object') {
            for (str2 in data[str]) {
                if (typeof data[str][str2] === 'string') spookyReply = spookyReply + "\n" + data[str][str2];
            }
        }
    }

    return spookyReply;
  }
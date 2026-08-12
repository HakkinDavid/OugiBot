module.exports =

async function generateText(input = []) {
    console.log("Generating AI text for input\n" + JSON.stringify(input));
    try {
      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'OugiBot/1.0'
        },
        body: JSON.stringify({
          messages: input,
          seed: Math.floor(1000 * Math.random() + 1),
          model: 'openai',
          jsonMode: false
        })
      });
    
      const data = await response.text();
      if (!data || data.includes('<!DOCTYPE html>') || data.includes('Invalid API key') || data.includes('unauthorized')) {
        return null;
      }
      return data;
    } catch (e) {
      console.error("Pollinations AI text error:", e);
      return null;
    }
}
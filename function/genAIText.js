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

    return ougi.getNestedString(data);
  }
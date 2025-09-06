module.exports =

async function generateText(input = []) {
    console.log("Generating AI text for input\n" + input.join(" "));
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: input,
        seed: 100 * Math.random() + 1,
        model: 'openai-fast',
        jsonMode: true
      })
    });

    console.log("Data (raw)\n" + JSON.stringify(response));
  
    const data = await response.json();

    return ougi.getNestedString(data);
  }
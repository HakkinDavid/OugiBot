const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = async function (arguments, msg) {
  if (!arguments.length) {
    msg.channel.send(await ougi.text({ msg, stringID: "keywordRequired" })).catch(console.error);
    return;
  }

  const query = arguments.join(" ");

  try {
    const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
    const meals = res.data?.meals;

    if (!meals || meals.length === 0) {
      msg.channel.send(await ougi.text({ msg, stringID: "resultsZero" })).catch(console.error);
      return;
    }

    const meal = meals[Math.floor(Math.random() * meals.length)];

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`• ${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`);
      }
    }

    const embed = new EmbedBuilder()
      .setTitle(meal.strMeal)
      .setURL(meal.strSource || meal.strYoutube || "https://www.themealdb.com/")
      .setAuthor({ name: meal.strCategory || "Recipe" })
      .setThumbnail(meal.strMealThumb)
      .setDescription(`**Category:** ${meal.strCategory} | **Cuisine:** ${meal.strArea}\n\n**Instructions:**\n${meal.strInstructions?.slice(0, 1000)}...`)
      .addFields({ name: await ougi.text({ msg, stringID: "ingredients" }), value: ingredients.join("\n").slice(0, 1024) || "N/A" })
      .setColor("#6E2C00")
      .setFooter({ text: await ougi.text({ msg, stringID: "recipe_footer" }), iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) })
      .setTimestamp();

    await msg.channel.send({ embeds: [embed] });
  } catch (error) {
    console.error("Error in recipeCommand:", error);
    msg.channel.send(await ougi.text({ msg, stringID: "resultsZero" })).catch(console.error);
  }
};
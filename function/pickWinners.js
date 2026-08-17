const crypto = require('crypto');

module.exports = async function (participants, winnersCount) {
    if (!Array.isArray(participants) || participants.length === 0 || winnersCount <= 0) {
        return [];
    }

    // Filter confirmed participants with positive weight
    let pool = participants
        .filter(p => p && p.confirmed && typeof p.weight === 'number' && p.weight > 0)
        .map(p => ({ ...p, weight: Math.floor(p.weight) }));

    if (pool.length === 0) return [];

    const winners = [];
    const targetCount = Math.min(winnersCount, pool.length);

    for (let w = 0; w < targetCount; w++) {
        let totalWeight = pool.reduce((acc, p) => acc + p.weight, 0);
        if (totalWeight <= 0) break;

        let randomTicket = crypto.randomInt(0, totalWeight);
        let cumulative = 0;
        let selectedIndex = -1;

        for (let i = 0; i < pool.length; i++) {
            cumulative += pool[i].weight;
            if (randomTicket < cumulative) {
                selectedIndex = i;
                break;
            }
        }

        if (selectedIndex === -1) selectedIndex = pool.length - 1;

        winners.push(pool[selectedIndex]);
        // Remove winner from pool so the same participant cannot win twice in the same draw
        pool.splice(selectedIndex, 1);
    }

    return winners;
};
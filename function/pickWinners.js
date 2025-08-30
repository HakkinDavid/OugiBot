module.exports = async function (participants, winnersCount) {
    // Filter only confirmed participants
    const confirmedParticipants = participants.filter(p => p.confirmed && p.weight > 0);
    if (confirmedParticipants.length === 0 || winnersCount <= 0) {
        return [];
    }

    // Create a weighted list of indices
    let weightedIndices = [];
    confirmedParticipants.forEach((participant, index) => {
        for (let i = 0; i < participant.weight; i++) {
            weightedIndices.push(index);
        }
    });

    const winners = new Set();

    while (winners.size < Math.min(winnersCount, confirmedParticipants.length)) {
        const randomIndex = Math.floor(Math.random() * weightedIndices.length);
        const winnerIndex = weightedIndices[randomIndex];
        winners.add(winnerIndex);

        // Remove all entries of the winner from weightedIndices to avoid duplicates
        weightedIndices = weightedIndices.filter(i => i !== winnerIndex);
        if (weightedIndices.length === 0) break;
    }

    return Array.from(winners).map(i => confirmedParticipants[i]);
}
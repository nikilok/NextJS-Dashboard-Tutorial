function competition(competition, results) {
  const hash = {};

  competition.forEach((match, index) => {
    const [homeTeam, awayTeam] = match;
    const score = results[index];
    const winningTeam = score === 0 ? homeTeam : awayTeam;
    if (hash[winningTeam]) {
      hash[winningTeam] = hash[winningTeam] + 1;
    } else {
      hash[winningTeam] = 1;
    }
  });
  let highestTeam = '';
  let highestScore = 0;
  for (const [team, teamScore] of Object.entries(hash)) {
    if (teamScore > highestScore) {
      highestScore = teamScore;
      highestTeam = team;
    }
  }
  return highestTeam;
}
const result = competition(
  [
    ['HTML', 'C#'],
    ['C#', 'Python'],
    ['JS', 'HTML'],
  ],
  [0, 1, 1],
);
/**
 * [
 ['HTML': 2],
 ['Python': 1],
 * ]
 */
console.log('🚀 ~ result:', result);

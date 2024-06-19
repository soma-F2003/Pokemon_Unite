const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let votes = [];

app.post('/vote', (req, res) => {
    const { pokemon, tier } = req.body;
    const timestamp = new Date();

    votes.push({ pokemon, tier, timestamp });
    res.status(200).send('Vote received');
});

app.get('/tier-list', (req, res) => {
    const { period } = req.query;
    const now = new Date();
    let filteredVotes;

    if (period === 'week') {
        const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        filteredVotes = votes.filter(vote => new Date(vote.timestamp) >= oneWeekAgo);
    } else if (period === 'month') {
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        filteredVotes = votes.filter(vote => new Date(vote.timestamp) >= oneMonthAgo);
    } else {
        filteredVotes = votes;
    }

    let voteCounts = {};

    filteredVotes.forEach(vote => {
        if (!voteCounts[vote.pokemon]) {
            voteCounts[vote.pokemon] = { S: 0, A: 0, B: 0, C: 0, D: 0 };
        }
        voteCounts[vote.pokemon][vote.tier]++;
    });

    let tierList = {
        S: [],
        A: [],
        B: [],
        C: [],
        D: []
    };

    Object.keys(voteCounts).forEach(pokemon => {
        let maxTier = 'D';
        let maxCount = 0;
        Object.keys(voteCounts[pokemon]).forEach(tier => {
            if (voteCounts[pokemon][tier] > maxCount) {
                maxTier = tier;
                maxCount = voteCounts[pokemon][tier];
            }
        });
        tierList[maxTier].push(pokemon);
    });

    res.json(tierList);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

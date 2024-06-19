const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let tierList = {
    S: [],
    A: [],
    B: [],
    C: [],
    D: []
};

app.post('/vote', (req, res) => {
    const { pokemon, tier } = req.body;
    if (tierList[tier] && !tierList[tier].includes(pokemon)) {
        tierList[tier].push(pokemon);
        res.status(200).send('Vote received');
    } else {
        res.status(400).send('Invalid request');
    }
});

app.get('/tier-list', (req, res) => {
    res.json(tierList);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

document.getElementById('vote-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const pokemon = document.getElementById('pokemon').value;
    const tier = document.getElementById('tier').value;

    fetch('http://localhost:3000/vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pokemon, tier })
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'Vote received') {
            updateTierList();
        } else {
            alert('投票に失敗しました。');
        }
    });
});

document.getElementById('apply-filter').addEventListener('click', function() {
    updateTierList();
});

function updateTierList() {
    const period = document.getElementById('filter-period').value;

    fetch(`http://localhost:3000/tier-list?period=${period}`)
        .then(response => response.json())
        .then(data => {
            ['S', 'A', 'B', 'C', 'D'].forEach(tier => {
                const tierList = document.getElementById(tier).querySelector('ul');
                tierList.innerHTML = '';
                data[tier].forEach(pokemon => {
                    const listItem = document.createElement('li');
                    listItem.textContent = pokemon;
                    tierList.appendChild(listItem);
                });
            });
        });
}

// 初期表示
updateTierList();

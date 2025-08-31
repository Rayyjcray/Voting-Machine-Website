// dashboard.js
(() => {
  const ELECTION_KEY = 'electionData';

  const positions = ['president', 'vicePresident', 'treasurer', 'secretary', 'pio'];

  function loadData() {
    try {
      const raw = localStorage.getItem(ELECTION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function render() {
    const data = loadData();
    if (!data) return;

    positions.forEach(pos => {
      const list = document.getElementById(`list-${pos}`);
      if (!list) return;
      list.innerHTML = '';

      const votes = data.votes?.[pos] || {};
      Object.keys(votes).forEach(name => {
        const li = document.createElement('li');
        const label = document.createElement('span');
        const count = document.createElement('span');
        label.textContent = name;
        count.textContent = votes[name];
        count.className = 'count';
        li.appendChild(label);
        li.appendChild(count);
        list.appendChild(li);
      });
    });

    const status = document.getElementById('status');
    if (status) status.textContent = `Last updated: ${new Date().toLocaleString()}`;
  }

  function ensureInitialized() {
    if (!loadData()) {
      const base = {
        votes: {
          president: { 'Catherine Binaya': 0, 'Steven Nash Placino': 0 },
          vicePresident: { 'Angela Evangelista': 0, 'Godwin Howard Macaraan': 0 },
          treasurer: { 'Jessan Romo': 0, 'Nikki Peras': 0 },
          secretary: { 'Julia Yuse': 0, 'Ray Joshua Catli': 0 },
          pio: { 'Jose Bangate': 0, 'Isha Deapera': 0 }
        },
        votedIds: []
      };
      localStorage.setItem(ELECTION_KEY, JSON.stringify(base));
    }
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureInitialized();
    render();

    document.getElementById('refresh')?.addEventListener('click', async () => {
      await delay(500); // async/await simulated delay
      render();
    });

    // Update when storage changes in other tabs/windows
    window.addEventListener('storage', async (e) => {
      if (e.key === ELECTION_KEY) {
        await delay(500);
        render();
      }
    });
  });
})();

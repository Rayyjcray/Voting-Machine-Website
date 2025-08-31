// voting.js
(() => {
  const ELECTION_KEY = 'electionData';

  // singular keys matching the HTML names
  const CANDIDATES = {
    president: ['Catherine Binaya', 'Steven Nash Placino'],
    vicePresident: ['Angela Evangelista', 'Godwin Howard Macaraan'],
    treasurer: ['Jessan Romo', 'Nikki Peras'],
    secretary: ['Julia Yuse', 'Ray Joshua Catli'],
    pio: ['Jose Bangate', 'Isha Deapera']
  };

  function makeInitialData() {
    const votes = {};
    Object.keys(CANDIDATES).forEach(pos => {
      votes[pos] = {};
      CANDIDATES[pos].forEach(name => votes[pos][name] = 0);
    });
    return { votes, votedIds: [] };
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(ELECTION_KEY);
      if (!raw) return makeInitialData();
      const data = JSON.parse(raw);
      // Normalize structure to ensure current candidates exist
      const base = makeInitialData();
      data.votes = data.votes || {};
      Object.keys(base.votes).forEach(pos => {
        data.votes[pos] = data.votes[pos] || {};
        Object.keys(base.votes[pos]).forEach(name => {
          if (typeof data.votes[pos][name] !== 'number') data.votes[pos][name] = 0;
        });
      });
      data.votedIds = Array.isArray(data.votedIds) ? data.votedIds : [];
      return data;
    } catch (err) {
      return makeInitialData();
    }
  }

  function saveData(data) {
    localStorage.setItem(ELECTION_KEY, JSON.stringify(data));
  }

  function setMessage(text, type = '') {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = 'message ' + (type ? type : '');
  }

  document.getElementById('submitVote')?.addEventListener('click', () => {
    const idInput = document.getElementById('studentId');
    const id = (idInput.value || '').trim();

    if (!id) {
      setMessage('Please enter your ID number before submitting.', 'error');
      idInput.focus();
      return;
    }

    const data = loadData();

    if (data.votedIds.includes(id)) {
      setMessage('This ID has already voted. Each ID can vote only once.', 'error');
      return;
    }

    const positions = Object.keys(CANDIDATES);
    const selections = {};

    for (const pos of positions) {
      const selected = document.querySelector(`input[name="${pos}"]:checked`);
      if (!selected) {
        setMessage(`Please select a candidate for ${pos}.`, 'error');
        return;
      }
      selections[pos] = selected.value;
    }

    // update tallies
    positions.forEach(pos => {
      const candidate = selections[pos];
      data.votes[pos][candidate] = (data.votes[pos][candidate] || 0) + 1;
    });

    data.votedIds.push(id);
    saveData(data);

    setMessage('Vote submitted successfully! Thank you for participating.', 'success');

    // Clear selections & ID
    document.getElementById('voteForm').reset();
  });

  // Initialize storage if missing
  (function ensureInitialized() {
    if (!localStorage.getItem(ELECTION_KEY)) {
      saveData(makeInitialData());
    }
  })();
})();

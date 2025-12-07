// script.js — PvP + PvC with smart-but-simple AI
// Ensure this file is saved as script.js and index.html references it.

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const boardEl = document.getElementById('board');
  const pvpBtn = document.getElementById('pvpBtn');
  const pvcBtn = document.getElementById('pvcBtn');
  const restartBtn = document.getElementById('restart');
  const resetScoresBtn = document.getElementById('resetScores');
  const turnDisplay = document.getElementById('turnDisplay');
  const scoreXEl = document.getElementById('scoreX');
  const scoreOEl = document.getElementById('scoreO');

  // State
  let board = Array(9).fill(null); // null | 'X' | 'O'
  let current = 'X';
  let running = true;
  let scores = { X: 0, O: 0 };
  let mode = 'pvp'; // default

  const WIN = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  // init board elements
  function createBoard() {
    boardEl.innerHTML = '';
    for (let i=0;i<9;i++){
      const btn = document.createElement('button');
      btn.className = 'cell';
      btn.dataset.index = i;
      btn.setAttribute('aria-label', `cell ${i+1}`);
      btn.addEventListener('click', onCellClick);
      boardEl.appendChild(btn);
    }
  }

  function render() {
    Array.from(boardEl.children).forEach((el, idx) => {
      const v = board[idx];
      el.textContent = v ? v : '';
      el.classList.toggle('x', v === 'X');
      el.classList.toggle('o', v === 'O');
      el.disabled = !running || !!v;
    });
    turnDisplay.textContent = current;
    scoreXEl.textContent = scores.X;
    scoreOEl.textContent = scores.O;
  }

  function checkWinner(state = board) {
    for (const line of WIN) {
      const [a,b,c] = line;
      if (state[a] && state[a] === state[b] && state[a] === state[c]) {
        return { winner: state[a], line };
      }
    }
    if (state.every(Boolean)) return { winner: 'tie' };
    return null;
  }

  function highlight(line) {
    if (!line) return;
    line.forEach(i => boardEl.children[i].classList.add('win'));
  }

  function onCellClick(e) {
    const idx = Number(e.currentTarget.dataset.index);
    if (!running || board[idx]) return;
    makeMove(idx);
  }

  function makeMove(idx) {
    if (!running || board[idx]) return;
    board[idx] = current;
    clearWinHighlights();
    const result = checkWinner();
    if (result) {
      running = false;
      if (result.winner === 'tie') {
        setTimeout(()=> alert("It's a tie!"), 80);
      } else {
        scores[result.winner] += 1;
        highlight(result.line);
        setTimeout(()=> alert(`Player ${result.winner} wins!`), 80);
      }
      render();
      return;
    }
    // switch
    current = current === 'X' ? 'O' : 'X';
    render();

    // If PvC and it's O's turn -> AI
    if (mode === 'pvc' && current === 'O' && running) {
      // small delay to feel natural
      setTimeout(() => {
        const aiIdx = computeAIMove('O');
        if (aiIdx !== null) makeMove(aiIdx);
      }, 300);
    }
  }

  function computeAIMove(player) {
    // returns index
    const opponent = player === 'X' ? 'O' : 'X';

    // 1) Win if possible
    for (let i=0;i<9;i++){
      if (!board[i]) {
        const copy = board.slice(); copy[i] = player;
        if (checkWinner(copy)?.winner === player) return i;
      }
    }
    // 2) Block opponent win
    for (let i=0;i<9;i++){
      if (!board[i]) {
        const copy = board.slice(); copy[i] = opponent;
        if (checkWinner(copy)?.winner === opponent) return i;
      }
    }
    // 3) Take center
    if (!board[4]) return 4;
    // 4) Take opposite corner if opponent in corner (basic tactic)
    const corners = [0,2,6,8];
    for (const c of corners) {
      if (board[c] === opponent) {
        const opp = 8 - c; // 0<->8, 2<->6 mapping works
        if (!board[opp]) return opp;
      }
    }
    // 5) Take any corner
    const freeCorners = corners.filter(i => !board[i]);
    if (freeCorners.length) return freeCorners[Math.floor(Math.random()*freeCorners.length)];
    // 6) Any side
    const sides = [1,3,5,7].filter(i => !board[i]);
    if (sides.length) return sides[Math.floor(Math.random()*sides.length)];
    // fallback
    const empties = board.map((v,i)=> v? -1:i).filter(i=> i>=0);
    return empties.length ? empties[Math.floor(Math.random()*empties.length)] : null;
  }

  function clearWinHighlights(){
    Array.from(boardEl.children).forEach(c => c.classList.remove('win'));
  }

  // Controls
  pvpBtn.addEventListener('click', () => {
    mode = 'pvp';
    pvpBtn.classList.add('active');
    pvcBtn.classList.remove('active');
    resetRound();
    console.info('Mode set to PvP');
  });
  pvcBtn.addEventListener('click', () => {
    mode = 'pvc';
    pvcBtn.classList.add('active');
    pvpBtn.classList.remove('active');
    resetRound();
    console.info('Mode set to PvC');
  });

  restartBtn.addEventListener('click', resetRound);
  resetScoresBtn.addEventListener('click', () => {
    if (confirm('Reset scores to zero?')) {
      scores = { X: 0, O: 0 };
      resetRound();
    }
  });

  function resetRound() {
    board = Array(9).fill(null);
    current = 'X';
    running = true;
    clearWinHighlights();
    render();
    // If mode is PVC and computer should start (optional): currently X always starts
  }

  // Keyboard support: 1..9 mapped to board (numpad style)
  document.addEventListener('keydown', e => {
    const map = { '1':6,'2':7,'3':8,'4':3,'5':4,'6':5,'7':0,'8':1,'9':2 };
    if (map[e.key]) {
      const idx = map[e.key];
      if (mode && running) makeMove(idx);
    }
    if (e.key.toLowerCase() === 'r') resetRound();
  });

  // Initialize
  createBoard();
  resetRound();
  console.info('Tic-Tac-Toe initialized. Default mode: PvP. Click mode buttons to switch to PvC.');
});

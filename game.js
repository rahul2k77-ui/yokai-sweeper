class YokaiEscapeGame {
  constructor(rows = 6, cols = 6) {
    this.ROWS = rows;
    this.COLS = cols;
    this.NUM_GHOSTS = 3;
    this.NUM_TRAPS = 2;
    this.DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    this.gridElement = document.getElementById('grid');
    this.clueBox = document.getElementById('clueBox');
    this.winOverlay = document.getElementById('winOverlay');
    this.loseOverlay = document.getElementById('loseOverlay');
    this.loseMsg = document.getElementById('loseMsg');

    this.bindEvents();
    this.init();
}

bindEvents() {
    document.getElementById('restartBtn').addEventListener('click', () => this.init());
    document.querySelectorAll('.close-overlay').forEach(btn => {
      btn.addEventListener('click', () => {
        this.winOverlay.classList.remove('show');
        this.loseOverlay.classList.remove('show');
        this.init();
      });
    });
}

init() {
    this.gameOver = false;
    this.visited = new Set();
    this.flagged = new Set();
    this.ghosts = new Set();
    this.traps = new Set();

    this.playerPos = { r: 0, c: 0 };
    this.visited.add('0,0');
    this.exitPos = { r: this.ROWS - 1, c: this.COLS - 1 };

    this.placeEntities();
    this.render();
    this.updateClue();
}

placeEntities() {
    const forbidden = new Set(['0,0', `${this.ROWS - 1},${this.COLS - 1}`, '0,1', '1,0']);
    while (this.ghosts.size < this.NUM_GHOSTS) {
      const r = Math.floor(Math.random() * this.ROWS);
      const c = Math.floor(Math.random() * this.COLS);
      const k = `${r},${c}`;
      if (!forbidden.has(k)) { this.ghosts.add(k); forbidden.add(k); }
    }
    while (this.traps.size < this.NUM_TRAPS) {
      const r = Math.floor(Math.random() * this.ROWS);
      const c = Math.floor(Math.random() * this.COLS);
      const k = `${r},${c}`;
      if (!forbidden.has(k)) { this.traps.add(k); forbidden.add(k); }
    }
}

getClues(r, c) {
    let ghostNearby = false;
    let trapNearby = false;

    for (const [dr, dc] of this.DIRS) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= this.ROWS || nc < 0 || nc >= this.COLS) continue;
      const k = `${nr},${nc}`;
      if (this.ghosts.has(k)) ghostNearby = true;
      if (this.traps.has(k)) trapNearby = true;
    }
    return { ghostNearby, trapNearby };
}

updateClue() {
    const { ghostNearby, trapNearby } = this.getClues(this.playerPos.r, this.playerPos.c);
    const clues = [];

    if (ghostNearby) clues.push('👹 <span style="color:#ff7b72">You hear the rustling of leaves... a Yokai is near.</span>');
    if (trapNearby) clues.push('🏮 <span style="color:#d2a8ff">Glowing mist gathers... a curse is nearby.</span>');
    if (!ghostNearby && !trapNearby) clues.push('<span style="color:#3fb950">✓ The air is still. This path is safe.</span>');

    const dr = this.exitPos.r - this.playerPos.r;
    const dc = this.exitPos.c - this.playerPos.c;
    const hint = `<span style="color:#8b949e">The Torii gate is ${Math.abs(dr)} row(s) ${dr > 0 ? 'south' : 'north'}, ${Math.abs(dc)} col(s) ${dc > 0 ? 'east' : 'west'}.</span>`;

    this.clueBox.innerHTML = clues.join('<br>') + '<br>' + hint;
}

moveTo(nr, nc) {
    if (this.gameOver) return;

    const dr = Math.abs(nr - this.playerPos.r);
    const dc = Math.abs(nc - this.playerPos.c);
    if (dr + dc !== 1) return;

    const k = `${nr},${nc}`;
    this.playerPos = { r: nr, c: nc };
    this.visited.add(k);
    this.flagged.delete(k);

    if (this.ghosts.has(k)) {
      this.triggerGameOver('👹', '#ff7b72', 'A Yokai found you!', 'You ignored the rustling leaves.');
      return;
    }

    if (this.traps.has(k)) {
      this.triggerGameOver('🏮', '#d2a8ff', 'You stepped into a curse!', 'The glowing mist was a warning.');
      return;
    }

    if (nr === this.exitPos.r && nc === this.exitPos.c) {
      this.gameOver = true;
      this.render();
      this.winOverlay.classList.add('show');
      return;
    }

    this.render();
    this.updateClue();
  }

  triggerGameOver(icon, color, title, subtitle) {
    this.gameOver = true;
    this.render();
    this.loseMsg.innerHTML = `${icon} <span style="color:${color}">${title}</span><br><span style="font-size:0.9rem;color:#8b949e">${subtitle}</span>`;
    this.loseOverlay.classList.add('show');
  }

  toggleFlag(r, c, e) {
    e.preventDefault();
    if (this.gameOver) return;
    
    const k = `${r},${c}`;
    if (this.visited.has(k)) return;
    
    if (this.flagged.has(k)) this.flagged.delete(k);
    else this.flagged.add(k);
    
    this.render();
  }

  render() {
    this.gridElement.innerHTML = '';

    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        const k = `${r},${c}`;

        const dr = Math.abs(r - this.playerPos.r);
        const dc = Math.abs(c - this.playerPos.c);
        const isAdjacent = (dr + dc === 1);

        if (r === this.playerPos.r && c === this.playerPos.c) {
          cell.classList.add('current');
          cell.textContent = '🥷';
        } else if (this.visited.has(k)) {
          cell.classList.add('visited');
          if (r === this.exitPos.r && c === this.exitPos.c) cell.textContent = '⛩️';
          
          const { ghostNearby, trapNearby } = this.getClues(r, c);
          if (!cell.textContent) {
            if (ghostNearby && trapNearby) cell.textContent = '👹🏮';
            else if (ghostNearby) cell.textContent = '👹';
            else if (trapNearby) cell.textContent = '🏮';
            else cell.textContent = '·';
          }
          cell.style.fontSize = '0.8rem';
          cell.style.color = '#8b949e';

        } else if (this.gameOver && (this.ghosts.has(k) || this.traps.has(k))) {
          cell.classList.add('visited');
          cell.textContent = this.ghosts.has(k) ? '👹' : '🏮';
        } else if (this.flagged.has(k)) {
          cell.classList.add('flagged');
          cell.textContent = '⚑';
          cell.style.color = '#ff7b72';
          cell.style.fontSize = '1.2rem';
          if (isAdjacent) cell.classList.add('reachable');
          cell.onclick = () => this.moveTo(r, c);
          cell.oncontextmenu = (e) => this.toggleFlag(r, c, e);
        } else {
          cell.classList.add('hidden');
          if (isAdjacent) {
            cell.classList.add('reachable');
            cell.onclick = () => this.moveTo(r, c);
          }
          cell.oncontextmenu = (e) => this.toggleFlag(r, c, e);
        }

        this.gridElement.appendChild(cell);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new YokaiEscapeGame();
});
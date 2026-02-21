let board = null;
let game = new Chess();
let moveHistory = [];

const statusEl = document.getElementById('status');

function updateStatus() {
  let status = '';
  const turn = game.turn() === 'w' ? 'Ақ' : 'Қара';

  if (game.in_checkmate()) {
    status = `Мат! ${turn === 'Ақ' ? 'Қара' : 'Ақ'} жеңді!`;
  } else if (game.in_draw()) {
    status = 'Тең ойын!';
  } else if (game.in_check()) {
    status = `${turn} фигураларға шах!`;
  } else {
    status = `${turn} фигуралар жүреді`;
  }

  statusEl.textContent = status;
}

function makeRandomMove() {
  if (game.game_over()) return;

  const possibleMoves = game.moves();
  if (possibleMoves.length === 0) return;

  const randomIdx = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIdx]);
  board.position(game.fen());
  updateStatus();

  if (game.game_over()) {
    setTimeout(() => {
      alert(statusEl.textContent);
    }, 400);
  }
}

function onDrop(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q' // әрқашан ферзьге ауыстыру
  });

  if (move === null) return 'snapback';

  moveHistory.push(move);
  updateStatus();

  setTimeout(makeRandomMove, 350);
}

function onSnapEnd() {
  board.position(game.fen());
}

function newGame() {
  game.reset();
  board.position('start');
  moveHistory = [];
  updateStatus();
}

function undoMove() {
  if (moveHistory.length < 2) return; // кемінде 2 жүріс болуы керек (адам + компьютер)

  game.undo(); // компьютер
  game.undo(); // адам
  moveHistory.pop();
  moveHistory.pop();
  board.position(game.fen());
  updateStatus();
}

// Шахмат тақтасын құру
const config = {
  draggable: true,
  position: 'start',
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
};

board = Chessboard('board', config);
updateStatus();
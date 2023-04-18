"use strict";
//#region GLOBAL
// #endregion
//#region FANORONA3
class Fanorona3 {
    constructor() {
        this._player = 1;
        this._tour = 0;
        this._matrice = [
            [{ player: 2, isAlreadyMoved: false }, { player: 2, isAlreadyMoved: false }, { player: 2, isAlreadyMoved: false }],
            [null, null, null],
            [{ player: 1, isAlreadyMoved: false }, { player: 1, isAlreadyMoved: false }, { player: 1, isAlreadyMoved: false }]
        ];
    }
    get matrice() {
        return this._matrice;
    }
    get tour() {
        return this._tour;
    }
    get player() {
        return this._player;
    }
    changePlayer() {
        this._player = (1 == this._player) ? 2 : 1;
    }
    posibilities(piece) {
        const piecePositionArr = [piece.y, piece.x];
        const allMovePossibilities = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
        var movePossibilities = allMovePossibilities;
        const patreon = this.transform();
        const indexPiece = ((piecePositionArr[0] * patreon[0].length) + piecePositionArr[1]);
        if (indexPiece % 2 != 0) {
            movePossibilities[4] = null;
            movePossibilities[5] = null;
            movePossibilities[6] = null;
            movePossibilities[7] = null;
        }
        var theMovePossibilities = [];
        allMovePossibilities.forEach((value) => {
            if (value != null) {
                var position = [piecePositionArr[0] - value[0], piecePositionArr[1] - value[1]];
                if (patreon[position[0]] != null) {
                    if (0 == patreon[position[0]][position[1]]) {
                        theMovePossibilities.push(value);
                    }
                }
            }
        });
        return theMovePossibilities;
    }
    moveTo(piece, position) {
        var move = false;
        var mouvement = { y: position.y - piece.y, x: position.x - piece.x };
        const to = [position.y, position.x];
        const from = [piece.y, piece.x];
        const fromPosition = { x: from[1], y: from[0] };
        const movePossibilities = this.posibilities(fromPosition);
        if (movePossibilities.some(p => p[0] == (from[0] - to[0]) && p[1] == (from[1] - to[1]))) {
            move = true;
        }
        if (true == move) {
            this._matrice[piece.y][piece.x] = { player: this._matrice[piece.y][piece.x].player, isAlreadyMoved: true };
            this._matrice[position.y][position.x] = this._matrice[piece.y][piece.x];
            this._matrice[piece.y][piece.x] = null;
            this._tour = this._tour + 1;
        }
    }
    // renvoie 1 ou 2 si un player a gagné sinon null
    win() {
        // teste si elles sont alignées
        if (this._horizontal(this._player) || this._vertical(this._player) || this._diagonal(this._player)) {
            // teste si toutes les pieces ont deja bougé
            if (this._isAllAreAlreadyMoved(this._player) == true) {
                return this._player;
            }
        }
        return null;
    }
    // transforme le tableau Piece en number pour faciliter certaines taches futur
    transform() {
        var transformed = [];
        this._matrice.forEach(ArrValue => {
            var arr = [];
            ArrValue.forEach(value => {
                arr.push((value == undefined) ? 0 : value.player);
            });
            transformed.push(arr);
        });
        return transformed;
    }
    print() {
        console.log(this.transform().reverse());
    }
    _horizontal(valueToSearch) {
        const arr = this.transform();
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].every((val) => val === valueToSearch)) {
                return true;
            }
        }
        return false;
    }
    _vertical(valueToSearch) {
        const arr = this.transform();
        for (let i = 0; i < arr.length; i++) {
            let count = 0;
            for (let j = 0; j < arr.length; j++) {
                if (valueToSearch === arr[j][i]) {
                    count++;
                }
            }
            if (arr.length === count) {
                return true;
            }
        }
        return false;
    }
    _diagonal(valueToSearch) {
        const arr = this.transform();
        let count = 0;
        for (let i = 0; i < arr.length; i++) {
            if (valueToSearch === arr[i][i]) {
                count++;
            }
        }
        if (arr.length === count) {
            return true;
        }
        count = 0;
        for (let i = 0; i < arr.length; i++) {
            if (valueToSearch === arr[i][arr.length - i - 1]) {
                count++;
            }
        }
        if (arr.length === count) {
            return true;
        }
        return false;
    }
    _isAllAreAlreadyMoved(valueToSearch) {
        var bool = true;
        this._matrice.forEach(arrValue => {
            arrValue.forEach(value => {
                if (null != value) {
                    if (valueToSearch == value.player && false == value.isAlreadyMoved) {
                        bool = false;
                    }
                }
            });
        });
        return bool;
    }
}
//#endregion
//#region BOARD
class Board {
    get canvas() {
        return this._canvas;
    }
    get ctx() {
        return this._ctx;
    }
    get circleCount() {
        return this._circleCount;
    }
    get circleRadius() {
        return this._circleRadius;
    }
    get spacingX() {
        return this._spacingX;
    }
    get spacingY() {
        return this._spacingY;
    }
    constructor() {
        this._canvas = document.querySelector("canvas");
        this._ctx = this._canvas.getContext('2d');
        this._circleCount = 3 * 3;
        this._circleRadius = 40;
        this._spacingX = 220;
        this._spacingY = 220;
    }
    draw(patreon, selectedPiece) {
        const pat = patreon.flat();
        const colors = ["#00000000", "#bdbdbd", '#000'];
        this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this._circleCount; i++) {
            const x = (i % 3) * this._spacingX + (this._circleRadius * 2);
            const y = Math.floor(i / 3) * this._spacingY + (this._circleRadius * 2);
            this._ctx.beginPath();
            if (i % 3 != 2) {
                this._ctx.moveTo(x, y);
                this._ctx.lineTo((x + this._spacingX), y);
            }
            this._ctx.stroke();
            this._ctx.closePath();
            // horizontale line
            this._ctx.beginPath();
            if (i < 6) {
                this._ctx.moveTo(x, y);
                this._ctx.lineTo(x, (y + this._spacingY));
            }
            this._ctx.stroke();
            this._ctx.closePath();
            // oblique up-left
            this._ctx.beginPath();
            if (i % 2 == 0 && i % 3 != 2 && i < 6) {
                this._ctx.moveTo(x, y);
                this._ctx.lineTo(x + this._spacingX, y + this._spacingY);
            }
            this._ctx.stroke();
            this._ctx.closePath();
            // oblique up-right
            this._ctx.beginPath();
            if (i % 2 == 0 && i % 3 != 0 && i < 6) {
                this._ctx.moveTo(x, y);
                this._ctx.lineTo(x - this._spacingX, y + this._spacingY);
            }
            this._ctx.stroke();
            this._ctx.closePath();
            this._ctx.beginPath();
            this._ctx.arc(x, y, this._circleRadius, 0, Math.PI * 2);
            this._ctx.fillStyle = colors[pat[i]];
            this._ctx.fill();
            this._ctx.closePath();
            if (selectedPiece == i) {
                this._ctx.beginPath();
                this._ctx.arc(x, y, this._circleRadius - 20, 0, Math.PI * 2);
                this._ctx.fillStyle = "green";
                this._ctx.fill();
                this._ctx.closePath();
            }
        }
    }
}
//#endregion
//#region CONTROLLER
class Controller {
    constructor() {
        this._board = new Board();
        this._fanorona = new Fanorona3();
        this._selectedPiece = null;
        this._board.draw(this._fanorona.transform(), null);
        this._event();
    }
    _action(piece) {
        const flatPatreon = this._fanorona.transform().flat();
        if (flatPatreon[piece] == this._fanorona.player) {
            this._selectedPiece = piece;
        }
        const n = this._fanorona.matrice.length;
        const m = this._fanorona.matrice[0].length;
        if (this._selectedPiece != null) {
            if (flatPatreon[this._selectedPiece] == this._fanorona.player) {
                this._board.draw(this._fanorona.transform(), this._selectedPiece);
            }
            if (flatPatreon[piece] == 0 && flatPatreon[this._selectedPiece] == this._fanorona.player) {
                const from = [Math.floor(this._selectedPiece / m), this._selectedPiece % m];
                const fromPosition = { x: from[1], y: from[0] };
                const to = [Math.floor(piece / m), piece % m];
                const toPosition = { x: to[1], y: to[0] };
                console.log(this._fanorona.posibilities(fromPosition));
                // Vérifier si le mouvement est autorisé
                if (this._fanorona.posibilities(fromPosition).some(p => p[0] == (from[0] - to[0]) && p[1] == (from[1] - to[1]))) {
                    this._fanorona.moveTo(fromPosition, toPosition);
                    this._board.draw(this._fanorona.transform(), null);
                    console.log("win:" + this._fanorona.win());
                    const p = document.querySelector('#winlog');
                    if (p) {
                        if (this._fanorona.win() == 1) {
                            p.innerHTML = "PLAYER 1 WIN";
                        }
                        else if (this._fanorona.win() == 2) {
                            p.innerHTML = "PLAYER 2 WIN";
                        }
                        p.className = "green";
                    }
                    this._fanorona.changePlayer();
                }
            }
            // Si la pièce cliquée appartient au joueur actuel, la sélectionner
            else if (flatPatreon[piece] == this._fanorona.player) {
                this._selectedPiece = piece;
            }
        }
    }
    _event() {
        for (let i = 0; i < this._board.circleCount; i++) {
            const x = (i % 3) * this._board.spacingX + (this._board.circleRadius * 2);
            const y = Math.floor(i / 3) * this._board.spacingY + (this._board.circleRadius * 2);
            this._board.canvas.addEventListener("click", (event) => {
                const rect = this._board.canvas.getBoundingClientRect();
                const clickX = event.clientX - rect.left;
                const clickY = event.clientY - rect.top;
                const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
                if (distance <= this._board.circleRadius) {
                    // Le clic se trouve dans le cercle i
                    this._action(i);
                }
            });
        }
    }
}
//#endregion
function main() {
    // adding some event
    const button = document.querySelector('.button');
    if (button != null) {
        button.addEventListener('click', function (e) {
            window.location.reload();
        });
    }
    new Controller();
}
main();
//# sourceMappingURL=main.js.map
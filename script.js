const cross = 'X';
const circle = 'O';
let currentPlayer = cross;
let audio_cross = new Audio("./audio/cross.mp3");
let audio_circle = new Audio("./audio/circle.mp3");
let audio_win = new Audio("./audio/win.mp3");
    audio_win.volume = 0.3;
let audio_restart = new Audio("./audio/restart.mp3");


let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];


function init() {
    renderBoard();
    updatePlayerSymbols();
}


function renderBoard() {
    // Alle Zellen im Spielfeld holen
    const cells = document.querySelectorAll('.cell');
    const board = document.querySelector('.board'); // Das Board-Element

    for (let index = 0; index < cells.length; index++) {
        const cell = cells[index];
        cell.onclick = function () {
            makeMove(index, cell); // Funktion zum Setzen des Symbols
        };
    }
}


function updatePlayerSymbols() {
    const circleSymbol = document.getElementById('playerCircle');
    const crossSymbol = document.getElementById('playerCross');

    if (currentPlayer === circle) {
        circleSymbol.classList.add('active');
        circleSymbol.classList.remove('inactive');
        crossSymbol.classList.add('inactive');
        crossSymbol.classList.remove('active');
    } else {
        crossSymbol.classList.add('active');
        crossSymbol.classList.remove('inactive');
        circleSymbol.classList.add('inactive');
        circleSymbol.classList.remove('active');
    }
}


// Funktion, die den Zug des Spielers ausführt
function makeMove(index, cell) {
    if (fields[index] === null) { // Wenn das Feld leer ist, einen Zug ausführen
        fields[index] = currentPlayer; // Symbol des aktuellen Spielers setzen

        // Abwechselnd das Symbol einfügen
        switch (currentPlayer) {
            case cross:
                cell.appendChild(createCross()); // Das Kreuz-Symbol einfügen
                audio_cross.play();
                break;
            case circle:
                cell.appendChild(createCircle()); // Das Kreis-Symbol einfügen
                audio_circle.play();
                break;
        }

        // Das 'onclick' Event entfernen, damit keine weiteren Züge gemacht werden können
        cell.onclick = null;

    }

    // Überprüfen, ob jemand gewonnen hat
    if (checkWin()) {
        drawWinLine();
        disableAllClicks();
        // Winner-Audio abspielen
        setTimeout(() => {
            audio_win.play();
        }, 600); // Startet nach 600ms
    } else {
        // Den aktuellen Spieler wechseln
        currentPlayer = (currentPlayer === cross) ? circle : cross;
        updatePlayerSymbols();
    }

    console.log(fields);
    
}


function createCircle() {
    const svgNamespace = "http://www.w3.org/2000/svg";

    // SVG-Element erstellen
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("width", "80"); // Breite des SVG
    svg.setAttribute("height", "80"); // Höhe des SVG
    svg.setAttribute("viewBox", "0 0 80 80");

    // Kreis-Element erstellen
    const circle = document.createElementNS(svgNamespace, "circle");
    circle.setAttribute("cx", "40"); // Kreismittelpunkt x
    circle.setAttribute("cy", "40"); // Kreismittelpunkt yS
    circle.setAttribute("r", "28"); // Radius (28px Durchmesser)
    circle.setAttribute("stroke", "#8c4b60"); // Farbe der Linie
    circle.setAttribute("stroke-width", "8"); // Breite der Linie (deutlich dicker)
    circle.setAttribute("fill", "none"); // Kein Füllbereich
    circle.setAttribute("stroke-dasharray", "175.93"); // LängeS des Kreises (2 * π * r)
    circle.setAttribute("stroke-dashoffset", "175.93"); // Vollständig "ausgeblendet"

    // Kreis um -90° drehen, damit die Animation oben startet
    circle.setAttribute("transform", "rotate(-90 40 40)");

    // Animation hinzufügen
    const animate = document.createElementNS(svgNamespace, "animate");
    animate.setAttribute("attributeName", "stroke-dashoffset");
    animate.setAttribute("from", "175.93"); // Startpunkt der Animation
    animate.setAttribute("to", "0"); // Endpunkt der Animation
    animate.setAttribute("dur", "0.40s"); // Dauer der Animation (400ms)
    animate.setAttribute("fill", "freeze"); // Nach der Animation stehen bleiben

    // Animation an den Kreis anhängen
    circle.appendChild(animate);

    // Kreis in das SVG-Element einfügen
    svg.appendChild(circle);

    return svg; // SVG-Element zurückgeben
}


function createCross() {
    const svgNamespace = "http://www.w3.org/2000/svg";

    // SVG-Element erstellen
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("width", "80");
    svg.setAttribute("height", "80");
    svg.setAttribute("viewBox", "0 0 80 80");

    // Erste Linie (links unten nach rechts oben)
    const line1 = document.createElementNS(svgNamespace, "line");
    line1.setAttribute("x1", "12"); // Startpunkt x (links unten)
    line1.setAttribute("y1", "68"); // Startpunkt y (links unten)
    line1.setAttribute("x2", "68"); // Endpunkt x (rechts oben)
    line1.setAttribute("y2", "12");  // Endpunkt y (rechts oben)
    line1.setAttribute("stroke", "#9c8959"); // Farbe der Linie
    line1.setAttribute("stroke-width", "8"); // Breite der Linie
    line1.setAttribute("stroke-dasharray", "79.37"); // Länge der Linie
    line1.setAttribute("stroke-dashoffset", "79.37"); // Linie vollständig "ausgeblendet"

    // Animation für die erste Linie
    const animate1 = document.createElementNS(svgNamespace, "animate");
    animate1.setAttribute("attributeName", "stroke-dashoffset");
    animate1.setAttribute("from", "79.37");
    animate1.setAttribute("to", "0");
    animate1.setAttribute("dur", "0.2s"); // Dauer der Animation für Linie 1
    animate1.setAttribute("fill", "freeze"); // Nach der Animation stehen bleiben
    line1.appendChild(animate1);

    // Zweite Linie (links oben nach rechts unten)
    const line2 = document.createElementNS(svgNamespace, "line");
    line2.setAttribute("x1", "12"); // Startpunkt x (links oben)
    line2.setAttribute("y1", "12"); // Startpunkt y (links oben)
    line2.setAttribute("x2", "68"); // Endpunkt x (rechts unten)
    line2.setAttribute("y2", "68"); // Endpunkt y (rechts unten)
    line2.setAttribute("stroke", "#9c8959"); // Farbe der Linie
    line2.setAttribute("stroke-width", "8"); // Breite der Linie
    line2.setAttribute("stroke-dasharray", "79.37"); // Länge der Linie
    line2.setAttribute("stroke-dashoffset", "79.37"); // Linie vollständig "ausgeblendet"

    // Animation für die zweite Linie
    const animate2 = document.createElementNS(svgNamespace, "animate");
    animate2.setAttribute("attributeName", "stroke-dashoffset");
    animate2.setAttribute("from", "79.37");
    animate2.setAttribute("to", "0");
    animate2.setAttribute("dur", "0.2s"); // Dauer der Animation für Linie 2
    animate2.setAttribute("fill", "freeze"); // Nach der Animation stehen bleiben
    animate2.setAttribute("begin", "0.2s"); // Startzeit der zweiten Animation (nach der ersten)
    line2.appendChild(animate2);

    // Linien in das SVG einfügen
    svg.appendChild(line1);
    svg.appendChild(line2);

    return svg; // SVG-Element zurückgeben
}


function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // horizontale Linien
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // vertikale Linien
        [0, 4, 8], [2, 4, 6],             // diagonale Linien
    ];

    for (const [a, b, c] of winPatterns) {
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return [a, b, c];  // Gibt die Indizes der Siegsfelder zurück
        }
    }
    return null;  // Kein Gewinn
}


function drawWinLine() {
    const winCells = checkWin(); // Indizes der Zellen, die gewonnen haben
    if (winCells) {
        const winline = document.querySelector('.winline');

        // Die Koordinaten der Zellen ermitteln, die den Gewinn ausmachen
        const cells = document.querySelectorAll('.cell');
        const cellA = cells[winCells[0]];
        const cellC = cells[winCells[2]];

        // Berechnung der Mittelpunkte der Zellen
        const getCenter = (cell) => {
            const rect = cell.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2, // Mitte der Zelle in X
                y: rect.top + rect.height / 2, // Mitte der Zelle in Y
            };
        };

        const centerA = getCenter(cellA);
        const centerC = getCenter(cellC);

        // Berechnung der Linie
        const startX = centerA.x;
        const startY = centerA.y;
        const endX = centerC.x;
        const endY = centerC.y;

        // Vektoren und Winkel
        const dx = endX - startX;
        const dy = endY - startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Verlängerung um 50%
        const extendedLength = length * 1.5;
        const factor = extendedLength / length;
        const extendedDX = dx * factor;
        const extendedDY = dy * factor;

        const newStartX = startX - (extendedDX - dx) / 2;
        const newStartY = startY - (extendedDY - dy) / 2;

        // Erstelle das `div` für die Linie
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.top = `${newStartY - 2}px`;
        line.style.left = `${newStartX - 2}px`;
        line.style.width = '0px'; // Startbreite auf 0 setzen
        line.style.height = '16px'; // Dicke der Linie
        line.style.backgroundColor = '#73568f';
        line.style.transformOrigin = '0 50%'; // Ursprung für Drehung
        line.style.transform = `rotate(${angle}deg)`; // Linie ausrichten
        line.style.pointerEvents = 'none'; // Verhindert Interaktionen
        line.style.transition = 'width 400ms ease-out'; // Animation der Breite

        // Linie in das `.winline`-Element einfügen
        winline.appendChild(line);

        // Nach 400ms die Breite der Linie auf die verlängerte Länge setzen
        setTimeout(() => {
            line.style.width = `${extendedLength}px`;
        }, 400); // Startet nach 400ms
    }
}


function disableAllClicks() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.onclick = null; // Entfernt den 'onclick' Handler
    });
}


function restartGame() {
    audio_restart.play();
    
    // Inhalte des Arrays zurücksetzen
    fields = Array(9).fill(null);

    // Spielfeld zurücksetzen
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.innerHTML = ''; // Inhalt der Zelle entfernen
        cell.onclick = null; // Klick-Event entfernen
    });

    // Vorherige Linie (falls vorhanden) entfernen
    const previousLine = document.querySelector('.winline div');
    if (previousLine) {
        previousLine.remove();
    }

    // Spielsymbole neu rendern
    renderBoard();

    // Aktuellen Spieler zurücksetzen (optional)
    currentPlayer = cross;
    updatePlayerSymbols();
}
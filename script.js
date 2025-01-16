const cross = 'X';
const circle = 'O';


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
]


let currentPlayer = cross;


function init() {
    renderBoard();
}


function renderBoard() {
    // Alle Zellen im Spielfeld holen
    const cells = document.querySelectorAll('.cell');
    const board = document.querySelector('.board'); // Das Board-Element

    // Vorherige Linie (falls vorhanden) entfernen
    const previousLine = board.querySelector('.win-line');
    if (previousLine) {
        previousLine.remove();
    }

    // Durch das 'fields'-Array iterieren und das jeweilige Symbol in die HTML-Zellen einfügen
    fields.forEach((fieldsElement, index) => {
        const cell = cells[index]; // Zelle aus dem DOM holen

        switch (fieldsElement) {
            case cross:
                cell.appendChild(createCross()); // Das Kreuz-Symbol einfügen
                break;
            case circle:
                cell.appendChild(createCircle()); // Das Kreis-Symbol einfügen
                break;
            default:
                // Das 'onclick' Event hinzufügen, wenn das Feld leer ist
                cell.onclick = function () {
                    makeMove(index, cell); // Funktion zum Setzen des Symbols
                };
        }
    });
}


// Funktion, die den Zug des Spielers ausführt
function makeMove(index, cell) {
    if (fields[index] === null) { // Wenn das Feld leer ist, einen Zug ausführen
        fields[index] = currentPlayer; // Symbol des aktuellen Spielers setzen

        // Abwechselnd das Symbol einfügen
        switch (currentPlayer) {
            case cross:
                cell.appendChild(createCross()); // Das Kreuz-Symbol einfügen
                break;
            case circle:
                cell.appendChild(createCircle()); // Das Kreis-Symbol einfügen
                break;
        }

        // Das 'onclick' Event entfernen, damit keine weiteren Züge gemacht werden können
        cell.onclick = null;

        // Den aktuellen Spieler wechseln
        currentPlayer = (currentPlayer === cross) ? circle : cross;
    }

    // Überprüfen, ob jemand gewonnen hat
    if (checkWin()) {
        drawWinLine();
        disableAllClicks();
    }
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
        winline.innerHTML = ''; // Vorherige Linie entfernen, falls vorhanden

        // Die Koordinaten der Zellen ermitteln, die den Gewinn ausmachen
        const cells = document.querySelectorAll('.cell');
        const cellA = cells[winCells[0]];
        const cellB = cells[winCells[1]];
        const cellC = cells[winCells[2]];

        // Berechnung der Mittelpunkte der Zellen (unter Berücksichtigung der Ränder)
        const getCenter = (cell) => {
            const rect = cell.getBoundingClientRect(); // Holt die Position der Zelle relativ zum Dokument
            return {
                x: rect.left + rect.width / 2,  // Mitte der Zelle in X
                y: rect.top + rect.height / 2   // Mitte der Zelle in Y
            };
        };

        const centerA = getCenter(cellA);
        const centerB = getCenter(cellB);
        const centerC = getCenter(cellC);

        // Berechnung der Linie, die durch diese Zellen verläuft
        const startX = centerA.x;
        const startY = centerA.y;
        const endX = centerC.x;
        const endY = centerC.y;

        // Berechnung der Vektoren
        const dx = endX - startX;
        const dy = endY - startY;
        const length = Math.sqrt(dx * dx + dy * dy); // Ursprüngliche Länge der Linie
        const angle = Math.atan2(dy, dx) * (180 / Math.PI); // Winkel der Linie

        // Verlängern der Linie um einen Prozentsatz der ursprünglichen Länge (z.B. 25%)
        const extendedLength = length + (length * 0.25); // Verlängerung um 25%

        // Berechnung der neuen Endpunkte basierend auf der verlängerten Länge
        const factor = extendedLength / length; // Faktor, um den Vektor zu verlängern
        const extendedDX = dx * factor;
        const extendedDY = dy * factor;

        const newStartX = startX - (extendedDX - dx) / 2; // Startpunkt verschieben
        const newStartY = startY - (extendedDY - dy) / 2; // Startpunkt verschieben
        const newEndX = endX + (extendedDX - dx) / 2; // Endpunkt verschieben
        const newEndY = endY + (extendedDY - dy) / 2; // Endpunkt verschieben

        // Erstelle das `div` für die Gewinnlinie
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.top = `${newStartY - 2}px`; // Position der Linie anpassen
        line.style.left = `${newStartX - 2}px`; // Position der Linie anpassen
        line.style.width = `${extendedLength}px`;
        line.style.height = '8px'; // Dicke der Linie
        line.style.backgroundColor = 'black';
        line.style.transformOrigin = '0 50%'; // Die Linie dreht sich um den Startpunkt
        line.style.transform = `rotate(${angle}deg)`; // Drehung der Linie, um den Winkel anzupassen
        line.style.pointerEvents = 'none'; // Verhindert, dass die Linie mit der Maus interagiert

        // Füge die Linie zum `.winline`-Container hinzu
        winline.appendChild(line);
    }
}


function disableAllClicks() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.onclick = null; // Entfernt den 'onclick' Handler
    });
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
    circle.setAttribute("stroke-width", "6"); // Breite der Linie (deutlich dicker)
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
    animate.setAttribute("dur", "0.40s"); // Dauer der Animation (250ms)
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
    line1.setAttribute("stroke-width", "6"); // Breite der Linie
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
    line2.setAttribute("stroke-width", "6"); // Breite der Linie
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
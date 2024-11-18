const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');

const maps = {
    fort: 'images/fort-map.png',
    skybridge: 'images/skybridge-map.png',
    bowl: 'images/bowl-map.png',
    bay5: 'images/bay5-map.png'
};

let currentMap = 'fort'; // Default map
let drawing = false;
let currentTool = 'pencil'; // Default tool
let eraseMode = false; // Eraser flag
let currentColor = "#FFFFFF"; // Default color
let currentThickness = 5; // Default thickness
let selectedUtility = null; // To store selected utility
let drawings = []; // Store drawing paths (coordinates)

let utilities = {
    flash: { icon: 'images/flash.png', x: 0, y: 0, size: 30 },
    smoke: { icon: 'images/smoke.png', x: 0, y: 0, size: 50 },
    frag: { icon: 'images/frag.png', x: 0, y: 0, size: 30 },
    molotov: { icon: 'images/molotov.png', x: 0, y: 0, size: 40 },
};

// Load map into canvas
function loadMap(mapName) {
    const mapImage = new Image();
    mapImage.src = maps[mapName];
    mapImage.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
        const ratio = Math.min(canvas.width / mapImage.width, canvas.height / mapImage.height);
        const width = mapImage.width * ratio;
        const height = mapImage.height * ratio;
        ctx.drawImage(mapImage, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height); // Center the image

        redrawDrawings(); // Redraw everything after the map is loaded
    };
}

// Handle map selection
document.querySelectorAll('.map-select').forEach(button => {
    button.addEventListener('click', (event) => {
        const mapName = event.target.getAttribute('data-map');
        currentMap = mapName;
        loadMap(currentMap);
    });
});

// Handle drawing on the canvas
canvas.addEventListener('mousedown', (e) => {
    if (currentTool === 'pencil' && !eraseMode) {
        drawing = true;
        draw(e);
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (drawing && currentTool === 'pencil' && !eraseMode) {
        draw(e);
    }
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
});

// Drawing function
function draw(e) {
    if (!drawing) return;

    const x = e.offsetX;
    const y = e.offsetY;

    // Save drawing data to the array
    drawings.push({
        x: x,
        y: y,
        size: currentThickness,
        color: currentColor
    });

    // Draw the circle
    ctx.beginPath();
    ctx.arc(x, y, currentThickness, 0, Math.PI * 2);
    ctx.fillStyle = currentColor; // Use the current color
    ctx.fill();
}

// Redraw previous drawings
function redrawDrawings() {
    drawings.forEach((drawing) => {
        ctx.beginPath();
        ctx.arc(drawing.x, drawing.y, drawing.size, 0, Math.PI * 2);
        ctx.fillStyle = drawing.color;
        ctx.fill();
    });
}

// Handle clear button
document.getElementById('clear-btn').addEventListener('click', () => {
    loadMap(currentMap); // Reload map to clear everything except map
});

// Handle eraser tool
document.getElementById('eraser-btn').addEventListener('click', () => {
    eraseMode = !eraseMode;
    currentTool = eraseMode ? 'eraser' : 'pencil';
    document.getElementById('eraser-btn').style.backgroundColor = eraseMode ? '#9a3c9f' : '#6c2b8e';
});

// Utility buttons
document.query

const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');

// Map settings
const maps = {
    fort: 'images/fort-map.png',
    skybridge: 'images/skybridge-map.png',
    bowl: 'images/bowl-map.png',
    bay5: 'images/bay5-map.png'
};
let currentMap = 'fort';
let drawings = [];
let scale = 1;
let offsetX = 0;
let offsetY = 0;

// Tool settings
let currentTool = 'pencil';
let color = '#ffffff';
let thickness = 3;

// Utilities
let selectedUtility = null;
let utilities = [];

// Load map
function loadMap(mapName) {
    const img = new Image();
    img.src = maps[mapName];
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        redrawDrawings();
        redrawUtilities();
        ctx.restore();
    };
}

// Redraw drawings
function redrawDrawings() {
    drawings.forEach(({ x, y, color, thickness }) => {
        ctx.beginPath();
        ctx.arc(x, y, thickness, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    });
}

// Redraw utilities
function redrawUtilities() {
    utilities.forEach(({ type, x, y }) => {
        const img = new Image();
        img.src = `images/${type}.png`;
        ctx.drawImage(img, x - 25, y - 25, 50, 50);
    });
}

// Draw on canvas
canvas.addEventListener('mousedown', (e) => {
    if (currentTool === 'pencil') {
        const x = (e.offsetX - offsetX) / scale;
        const y = (e.offsetY - offsetY) / scale;
        drawings.push({ x, y, color, thickness });
        redrawDrawings();
    } else if (selectedUtility) {
        const x = (e.offsetX - offsetX) / scale;
        const y = (e.offsetY - offsetY) / scale;
        utilities.push({ type: selectedUtility, x, y });
        selectedUtility = null;
        redrawUtilities();
    }
});

// Zoom functionality
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scale *= delta;
    offsetX -= (e.offsetX - offsetX) * (delta - 1);
    offsetY -= (e.offsetY - offsetY) * (delta - 1);
    loadMap(currentMap);
});

// Thickness
document.getElementById('small-thickness').addEventListener('click', () => thickness = 1);
document.getElementById('medium-thickness').addEventListener('click', () => thickness = 3);
document.getElementById('large-thickness').addEventListener('click', () => thickness = 5);

// Color
document.getElementById('color-picker').addEventListener('input', (e) => color = e.target.value);

// Clear
document.getElementById('clear-btn').addEventListener('click', () => {
    drawings = [];
    utilities = [];
    loadMap(currentMap);
});

// Map buttons
document.querySelectorAll('.map-select').forEach(btn => {
    btn.addEventListener('click', () => {
        currentMap = btn.dataset.map;
        loadMap(currentMap);
    });
});

// Utility selection
document.querySelectorAll('.utility-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        selectedUtility = btn.dataset.utility;
    });
});

// Initial map load
loadMap(currentMap);

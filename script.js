const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');

let currentMap = 'fort';
let drawings = [];
let utilities = [];
let drawing = false;
let selectedColor = '#FFFFFF';
let lineThickness = 5;
let zoomLevel = 1;
let currentUtilityType = null;

// Load map into the canvas
function loadMap(mapName) {
    const mapImage = new Image();
    mapImage.src = `images/${mapName}-map.png`;
    mapImage.onload = () => {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transforms
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(zoomLevel, zoomLevel);
        ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        redrawUtilities();
        redrawDrawings();
    };
}

// Redraw drawings
function redrawDrawings() {
    drawings.forEach(drawing => {
        ctx.beginPath();
        ctx.arc(drawing.x, drawing.y, drawing.thickness, 0, Math.PI * 2);
        ctx.fillStyle = drawing.color;
        ctx.fill();
    });
}

// Redraw utilities
function redrawUtilities() {
    utilities.forEach(util => {
        const img = new Image();
        img.src = util.src;
        img.onload = () => {
            ctx.drawImage(img, util.x, util.y, util.width, util.height);
        };
    });
}

// Drawing on canvas
canvas.addEventListener('mousedown', () => (drawing = true));
canvas.addEventListener('mouseup', () => (drawing = false));
canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    drawings.push({ x: e.offsetX / zoomLevel, y: e.offsetY / zoomLevel, color: selectedColor, thickness: lineThickness });
    redrawDrawings();
});

// Utility button clicks
document.querySelectorAll('.utility-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        currentUtilityType = e.target.id.replace('-btn', '');
    });
});

// Add utility on canvas click
canvas.addEventListener('click', (e) => {
    if (!currentUtilityType) return;
    utilities.push({ type: currentUtilityType, src: `images/${currentUtilityType}.png`, x: e.offsetX / zoomLevel - 25, y: e.offsetY / zoomLevel - 25, width: 50, height: 50 });
    redrawUtilities();
});

// Zoom functionality
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomLevel += e.deltaY > 0 ? -0.1 : 0.1;
    zoomLevel = Math.min(Math.max(zoomLevel, 0.5), 3); // Clamp between 0.5 and 3
    loadMap(currentMap);
});

// Color and thickness buttons
document.getElementById('color-red').addEventListener('click', () => (selectedColor = '#FF0000'));
document.getElementById('color-green').addEventListener('click', () => (selectedColor = '#00FF00'));
document.getElementById('color-blue').addEventListener('click', () => (selectedColor = '#0000FF'));

document.getElementById('small-thickness').addEventListener('click', () => (lineThickness = 5));
document.getElementById('medium-thickness').addEventListener('click', () => (lineThickness = 10));
document.getElementById('big-thickness').addEventListener('click', () => (lineThickness = 15));

// Clear button
document.getElementById('clear-btn').addEventListener('click', () => {
    drawings = [];
    utilities = [];
    loadMap(currentMap);
});

// Map selection
document.querySelectorAll('.map-select').forEach(button => {
    button.addEventListener('click', (e) => {
        currentMap = e.target.dataset.map;
        loadMap(currentMap);
    });
});

// Load the initial map
loadMap(currentMap);

const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');

// Utility definitions
const utilities = [];
let currentUtilityType = null;
let currentMap = 'fort';
let drawing = false;
let selectedColor = '#FFFFFF';
let lineThickness = 5;

// Load the map into the canvas
function loadMap(mapName) {
    const mapImage = new Image();
    mapImage.src = `images/${mapName}-map.png`;
    mapImage.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
    };
}

// Draw all utilities
function redrawUtilities() {
    utilities.forEach(utility => {
        const img = new Image();
        img.src = utility.src;
        img.onload = () => {
            ctx.drawImage(img, utility.x, utility.y, utility.width, utility.height);
        };
    });
}

// Add utility to canvas
function addUtility(type, x, y) {
    let utility = { type, src: `images/${type}.png`, x: x - 25, y: y - 25, width: 50, height: 50 };
    utilities.push(utility);
    redrawUtilities();
}

// Drawing on canvas
canvas.addEventListener('mousedown', () => (drawing = true));
canvas.addEventListener('mouseup', () => (drawing = false));
canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    ctx.beginPath();
    ctx.arc(e.offsetX, e.offsetY, lineThickness, 0, Math.PI * 2);
    ctx.fillStyle = selectedColor;
    ctx.fill();
});

// Handle utility button clicks
document.querySelectorAll('.utility-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        currentUtilityType = e.target.id.replace('-btn', '');
    });
});

// Add utility on canvas click
canvas.addEventListener('click', (e) => {
    if (currentUtilityType) addUtility(currentUtilityType, e.offsetX, e.offsetY);
});

// Color selection
document.getElementById('color-red').addEventListener('click', () => (selectedColor = '#FF0000'));
document.getElementById('color-green').addEventListener('click', () => (selectedColor = '#00FF00'));
document.getElementById('color-blue').addEventListener('click', () => (selectedColor = '#0000FF'));

// Thickness selection
document.getElementById('small-thickness').addEventListener('click', () => (lineThickness = 5));
document.getElementById('medium-thickness').addEventListener('click', () => (lineThickness = 10));
document.getElementById('big-thickness').addEventListener('click', () => (lineThickness = 15));

// Clear canvas
document.getElementById('clear-btn').addEventListener('click', () => {
    utilities.length = 0;
    loadMap(currentMap);
});

// Switch map
document.querySelectorAll('.map-select').forEach(button => {
    button.addEventListener('click', (e) => {
        currentMap = e.target.dataset.map;
        loadMap(currentMap);
    });
});

// Initial map load
loadMap(currentMap);

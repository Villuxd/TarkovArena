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
let selectedUtility = null; // To store selected utility
let eraseMode = false; // Eraser flag

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

// Draw on canvas
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

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF"; // Default white color for drawing
    ctx.fill();
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
document.querySelectorAll('.utility-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        selectedUtility = e.target.getAttribute('data-utility');
        if (selectedUtility === 'smoke') {
            drawSmoke(e.offsetX, e.offsetY);
        }
    });
});

// Draw smoke effect
function drawSmoke(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2); // Set radius to 50
    ctx.fillStyle = 'rgba(200, 200, 200, 0.5)'; // Light smoke color with transparency
    ctx.fill();
}

// Initial map load
loadMap(currentMap);

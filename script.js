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
let scale = 1; // Initial zoom level
let selectedUtility = null; // To store selected utility
let eraseMode = false; // Eraser flag

// Load map into canvas
function loadMap(mapName) {
    const mapImage = new Image();
    mapImage.src = maps[mapName];
    mapImage.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
        const ratio = Math.min(canvas.width / mapImage.width, canvas.height / mapImage.height);
        const width = mapImage.width * ratio * scale;  // Apply scale factor for zooming
        const height = mapImage.height * ratio * scale; // Apply scale factor for zooming
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
    ctx.arc(x, y, 50, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200, 200, 200, 0.5)'; // Light smoke color with transparency
    ctx.fill();
}

// Zoom In functionality
document.getElementById('zoom-in-btn').addEventListener('click', () => {
    scale += 0.1; // Increase zoom scale
    loadMap(currentMap); // Reload map with updated zoom
});

// Zoom Out functionality
document.getElementById('zoom-out-btn').addEventListener('click', () => {
    if (scale > 0.2) {  // Prevent zooming out too much
        scale -= 0.1; // Decrease zoom scale
        loadMap(currentMap); // Reload map with updated zoom
    }
});

// Add mouse wheel zoom functionality
canvas.addEventListener('wheel', (event) => {
    event.preventDefault(); // Prevent default scrolling behavior

    if (event.deltaY < 0) {
        // Mouse wheel up -> zoom in
        scale += 0.1;
    } else if (event.deltaY > 0) {
        // Mouse wheel down -> zoom out
        if (scale > 0.2) {  // Prevent zooming out too much
            scale -= 0.1;
        }
    }

    loadMap(currentMap); // Reload map with updated zoom scale
});

// Initial map load
loadMap(currentMap);

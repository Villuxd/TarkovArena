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
let drawingColor = 'white'; // Default drawing color
let drawingThickness = 5; // Default thickness (small)

let drawingObjects = []; // Store drawings persistently
let zoomLevel = 1; // Initial zoom level

// Load map into canvas
function loadMap(mapName) {
    const mapImage = new Image();
    mapImage.src = maps[mapName];
    mapImage.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
        const ratio = Math.min(canvas.width / mapImage.width, canvas.height / mapImage.height) * zoomLevel;
        const width = mapImage.width * ratio;
        const height = mapImage.height * ratio;
        ctx.drawImage(mapImage, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height); // Center the image
        redrawDrawings(); // Redraw persistent drawings
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
    } else if (selectedUtility) {
        placeUtility(e);
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
    ctx.arc(x, y, drawingThickness, 0, Math.PI * 2);
    ctx.fillStyle = drawingColor;
    ctx.fill();

    // Save the drawing for persistence
    drawingObjects.push({ x, y, thickness: drawingThickness, color: drawingColor });
}

// Redraw drawings after map load or zoom
function redrawDrawings() {
    drawingObjects.forEach(obj => {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.thickness, 0, Math.PI * 2);
        ctx.fillStyle = obj.color;
        ctx.fill();
    });
}

// Handle clear button
document.getElementById('clear-btn').addEventListener('click', () => {
    loadMap(currentMap); // Reload map to clear everything except map
    drawingObjects = []; // Clear drawings array
});

// Handle eraser tool
document.getElementById('eraser-btn').addEventListener('click', () => {
    eraseMode = !eraseMode;
    currentTool = eraseMode ? 'eraser' : 'pencil';
    document.getElementById('eraser-btn').style.backgroundColor = eraseMode ? '#9a3c9f' : '#6c2b8e';
});

// Handle color selection
document.querySelectorAll('.color-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        drawingColor = e.target.getAttribute('data-color');
    });
});

// Handle thickness selection
document.querySelectorAll('.thickness-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const thickness = e.target.getAttribute('data-thickness');
        if (thickness === 'small') {
            drawingThickness = 5;
        } else if (thickness === 'medium') {
            drawingThickness = 10;
        } else if (thickness === 'big') {
            drawingThickness = 15;
        }
    });
});

// Zoom functionality using mousewheel
canvas.addEventListener('wheel', (e) => {
    e.preventDefault(); // Prevent page scroll
    if (e.deltaY < 0) {
        zoomLevel += 0.1; // Zoom in
    } else {
        zoomLevel = Math.max(0.5, zoomLevel - 0.1); // Zoom out (with

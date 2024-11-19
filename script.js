const canvas = document.getElementById("map-canvas");
const ctx = canvas.getContext("2d");
let mapImage = new Image();
let mapX = 0, mapY = 0;
let zoomLevel = 1;
let isDragging = false;
let lastX = 0, lastY = 0;
let currentTool = 'draw';
let drawColor = '#FFFFFF';
let thickness = 5;
let drawnShapes = [];

const flashIcon = document.getElementById("flash-icon");
const smokeIcon = document.getElementById("smoke-icon");
const molotovIcon = document.getElementById("molotov-icon");
const fragIcon = document.getElementById("frag-icon");

const handTool = document.getElementById("hand-tool");
const pencilTool = document.getElementById("pencil-tool");
const smallThickness = document.getElementById("small-thickness");
const mediumThickness = document.getElementById("medium-thickness");
const bigThickness = document.getElementById("big-thickness");
const clearButton = document.getElementById("clear-button");

const zoomIn = document.getElementById("zoom-in");
const zoomOut = document.getElementById("zoom-out");

// Set initial map
mapImage.src = 'images/fort-map.png';

canvas.width = 800;
canvas.height = 600;

function redrawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, mapX, mapY, mapImage.width * zoomLevel, mapImage.height * zoomLevel);
}

function drawShape(x, y) {
    if (currentTool === 'draw') {
        ctx.beginPath();
        ctx.arc(x, y, thickness, 0, 2 * Math.PI);
        ctx.fillStyle = drawColor;
        ctx.fill();
    }
}

canvas.addEventListener('mousedown', (e) => {
    if (currentTool === 'draw') {
        isDragging = false;
        drawShape(e.offsetX, e.offsetY);
    } else if (currentTool === 'hand') {
        isDragging = true;
        lastX = e.offsetX;
        lastY = e.offsetY;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging && currentTool === 'hand') {
        const dx = e.offsetX - lastX;
        const dy = e.offsetY - lastY;
        mapX += dx;
        mapY += dy;
        lastX = e.offsetX;
        lastY = e.offsetY;
        redrawMap();
    }
    if (currentTool === 'draw' && !isDragging) {
        drawShape(e.offsetX, e.offsetY);
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('wheel', (e) => {
    const zoomSpeed = 0.1;
    if (e.deltaY < 0) {
        zoomLevel = Math.min(zoomLevel + zoomSpeed, 3);
    } else {
        zoomLevel = Math.max(zoomLevel - zoomSpeed, 0.5);
    }
    redrawMap();
});

// Event listeners for tool selection
handTool.addEventListener('click', () => {
    currentTool = 'hand';
});
pencilTool.addEventListener('click', () => {
    currentTool = 'draw';
});

// Thickness selection
smallThickness.addEventListener('click', () => {
    thickness = 5;
});
mediumThickness.addEventListener('click', () => {
    thickness = 10;
});
bigThickness.addEventListener('click', () => {
    thickness = 15;
});

clearButton.addEventListener('click', () => {
    drawnShapes = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redrawMap();
});

// Grenades click event handling
flashIcon.addEventListener('click', () => {
    // Create flash icon
});

smokeIcon.addEventListener('click', () => {
    // Create smoke radius
});

molotovIcon.addEventListener('click', () => {
    // Create molotov radius
});

fragIcon.addEventListener('click', () => {
    // Create frag radius
});

// Zoom handling
zoomIn.addEventListener('click', () => {
    zoomLevel = Math.min(zoomLevel + 0.1, 3);
    redrawMap();
});

zoomOut.addEventListener('click', () => {
    zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
    redrawMap();
});


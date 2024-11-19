const mapCanvas = document.getElementById('map-canvas');
const ctx = mapCanvas.getContext('2d');

let mapImage = new Image();
let mapX = 0, mapY = 0;
let zoom = 1;
let zoomFactor = 0.1;
let isDrawing = false;
let currentTool = null;
let currentColor = '#ff0000';
let currentThickness = 5;

let utilityIcons = [];

let smokeRadiusImage = new Image();
let molotovRadiusImage = new Image();

smokeRadiusImage.src = 'images/smoke-radius.png';
molotovRadiusImage.src = 'images/molotov-radius.png';

const width = 800;
const height = 600;

mapCanvas.width = width;
mapCanvas.height = height;

let isDragging = false;
let lastX = 0, lastY = 0;

let drawnShapes = [];
let utilityPositions = [];

function loadMap(mapName) {
    mapImage.src = `images/${mapName}-map.png`; 
    mapImage.onload = () => {
        ctx.drawImage(mapImage, mapX, mapY, mapImage.width * zoom, mapImage.height * zoom);
    };
}

document.getElementById('map-fort').addEventListener('click', () => loadMap('fort'));
document.getElementById('map-skybridge').addEventListener('click', () => loadMap('skybridge'));
document.getElementById('map-bowl').addEventListener('click', () => loadMap('bowl'));
document.getElementById('map-bay5').addEventListener('click', () => loadMap('bay5'));

document.getElementById('hand-tool').addEventListener('click', () => {
    currentTool = 'hand';
    mapCanvas.style.cursor = 'grab';
});

document.getElementById('pencil-tool').addEventListener('click', () => {
    currentTool = 'pencil';
    mapCanvas.style.cursor = 'crosshair';
});

document.getElementById('color-picker').addEventListener('input', (e) => {
    currentColor = e.target.value;
});

document.getElementById('small-thickness').addEventListener('click', () => {
    currentThickness = 5;
});

document.getElementById('medium-thickness').addEventListener('click', () => {
    currentThickness = 10;
});

document.getElementById('big-thickness').addEventListener('click', () => {
    currentThickness = 15;
});

document.getElementById('clear-button').addEventListener('click', () => {
    drawnShapes = [];
    utilityPositions = [];
    drawEverything();
});

mapCanvas.addEventListener('mousedown', (e) => {
    if (currentTool === 'hand') {
        isDragging = true;
        lastX = e.offsetX;
        lastY = e.offsetY;
    } else if (currentTool === 'pencil') {
        isDrawing = true;
        drawnShapes.push({
            type: 'line',
            color: currentColor,
            thickness: currentThickness,
            startX: e.offsetX,
            startY: e.offsetY,
            endX: e.offsetX,
            endY: e.offsetY
        });
        drawEverything();
    }
});

mapCanvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.offsetX - lastX;
        const deltaY = e.offsetY - lastY;
        mapX += deltaX;
        mapY += deltaY;
        lastX = e.offsetX;
        lastY = e.offsetY;
        drawEverything();
    } else if (isDrawing) {
        const shape = drawnShapes[drawnShapes.length - 1];
        shape.endX = e.offsetX;
        shape.endY = e.offsetY;
        drawEverything();
    }
});

mapCanvas.addEventListener('mouseup', () => {
    isDragging = false;
    isDrawing = false;
});

mapCanvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomDirection = e.deltaY < 0 ? 1 : -1;
    zoom = Math.min(Math.max(zoom + zoomDirection * zoomFactor, 0.5), 3);
    drawEverything();
});

function drawEverything() {
    ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    ctx.drawImage(mapImage, mapX, mapY, mapImage.width * zoom, mapImage.height * zoom);
    for (const shape of drawnShapes) {
        ctx.beginPath();
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.thickness;
        ctx.stroke();
    }
    for (const icon of utilityPositions) {
        ctx.drawImage(icon.image, icon.x, icon.y, icon.image.width * zoom, icon.image.height * zoom);
    }
}

function addUtilityIcon(image, x, y) {
    utilityPositions.push({
        image: image,
        x: x,
        y: y
    });
    drawEverything();
}

document.getElementById('flash-icon').addEventListener('click', () => {
    const flashIcon = new Image();
    flashIcon.src = 'images/flash-icon.png';
    flashIcon.onload = () => addUtilityIcon(flashIcon, 100, 100); // Example position
});

document.getElementById('smoke-icon').addEventListener('click', () => {
    addUtilityIcon(smokeRadiusImage, 200, 200); // Use the smoke radius image
});

document.getElementById('molotov-icon').addEventListener('click', () => {
    addUtilityIcon(molotovRadiusImage, 300, 300); // Use the molotov radius image
});

document.getElementById('frag-icon').addEventListener('click', () => {
    const fragIcon = new Image();
    fragIcon.src = 'images/frag-icon.png';
    fragIcon.onload = () => addUtilityIcon(fragIcon, 400, 400); // Example position
});

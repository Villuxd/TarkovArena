const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.parentElement.offsetWidth;
canvas.height = canvas.parentElement.offsetHeight;

// Load map images
const maps = {
    fort: 'images/fort.png',
    skybridge: 'images/skybridge.png',
    bowl: 'images/bowl.png',
    bay5: 'images/bay5.png'
};
let currentMap = maps.fort;
let zoom = 1;
let panX = 0, panY = 0;
let isPanning = false;
let startX, startY;

// Utility dragging
const utilities = ['flash', 'frag', 'molotov', 'smoke'];
let utilityElements = {};
utilities.forEach(util => {
    const img = document.getElementById(util);
    utilityElements[util] = { image: img, x: 0, y: 0, dragging: false };
});

// Drawing tools
let drawing = false;
let drawColor = '#000';
let thickness = 3;

// Load map
function loadMap(mapName) {
    const mapImg = new Image();
    mapImg.src = mapName;
    mapImg.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mapImg, 0, 0, canvas.width * zoom, canvas.height * zoom);
    };
}

loadMap(currentMap);

// Zoom function
canvas.addEventListener('wheel', e => {
    const zoomAmount = e.deltaY > 0 ? 0.9 : 1.1;
    zoom *= zoomAmount;
    panX += e.deltaX / zoom;
    panY += e.deltaY / zoom;
    loadMap(currentMap);
});

// Map buttons
document.querySelectorAll('#map-buttons button').forEach(button => {
    button.addEventListener('click', () => {
        currentMap = maps[button.id];
        zoom = 1; panX = 0; panY = 0;
        loadMap(currentMap);
    });
});

// Drawing functionality
canvas.addEventListener('mousedown', e => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', e => {
    if (drawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = thickness;
        ctx.stroke();
    }
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
});

// Hand tool
document.getElementById('handTool').addEventListener('click', () => {
    isPanning = !isPanning;
});

// Change thickness
document.getElementById('thicknessSmall').addEventListener('click', () => thickness = 3);
document.getElementById('thicknessMedium').addEventListener('click', () => thickness = 6);
document.getElementById('thicknessBig').addEventListener('click', () => thickness = 9);

// Color picker
document.getElementById('colorPicker').addEventListener('click', () => {
    const color = prompt('Enter a hex color code (e.g., #ff0000):', drawColor);
    if (color) drawColor = color;
});

// Clear canvas
document.getElementById('clearCanvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loadMap(currentMap);
});

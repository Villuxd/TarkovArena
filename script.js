// Get references to the canvas and context
const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');

// Initial map image and settings
let mapImage = new Image();
mapImage.src = 'images/bay5-map.png'; // Default map (can be changed)
let mapPosition = { x: 0, y: 0 };
let zoomLevel = 1;

// Variables to store the tool status
let activeTool = 'hand';
let activeUtility = null;
let utilityMarkers = [];

// Variables to track utility locations
let smokeX = 300, smokeY = 300; // Example coordinates
let molotovX = 500, molotovY = 500; // Example coordinates

// Function to draw smoke radius (foggy effect)
function drawSmokeRadius(x, y, scale) {
    ctx.beginPath();
    ctx.arc(x, y, 100 * scale, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(200, 200, 200, 0.4)";  // Light gray to simulate fog/smoke
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(200, 200, 200, 0.6)";  // Light gray border
    ctx.stroke();
}

// Function to draw Molotov radius (fire effect)
function drawMolotovRadius(x, y, scale) {
    ctx.beginPath();
    ctx.arc(x, y, 100 * scale, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 69, 0, 0.5)";  // Fire color (orange)
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 69, 0, 0.8)";  // Darker border for fire
    ctx.stroke();
}

// Draw the map image and reset canvas zoom on zoom and pan
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, mapPosition.x, mapPosition.y, mapImage.width * zoomLevel, mapImage.height * zoomLevel);
    utilityMarkers.forEach(marker => marker.draw());
}

// Handle mouse zoom event (zoom into cursor)
canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
    zoomLevel *= zoomFactor;

    // Zoom limit conditions
    zoomLevel = Math.max(0.5, Math.min(zoomLevel, 3));

    // Zoom into cursor position
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    mapPosition.x -= (mouseX - mapPosition.x) * (zoomFactor - 1);
    mapPosition.y -= (mouseY - mapPosition.y) * (zoomFactor - 1);

    redrawCanvas();
});

// Handle dragging the map (hand tool)
let isDragging = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', (event) => {
    if (activeTool === 'hand') {
        isDragging = true;
        lastX = event.offsetX;
        lastY = event.offsetY;
    }
});

canvas.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const dx = event.offsetX - lastX;
        const dy = event.offsetY - lastY;
        mapPosition.x += dx;
        mapPosition.y += dy;
        lastX = event.offsetX;
        lastY = event.offsetY;
        redrawCanvas();
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

// Handle adding utility effects on the map (smoke, molotov)
document.getElementById('smoke-icon').addEventListener('click', () => {
    activeUtility = 'smoke';
    drawSmokeRadius(smokeX, smokeY, zoomLevel);
});

document.getElementById('molotov-icon').addEventListener('click', () => {
    activeUtility = 'molotov';
    drawMolotovRadius(molotovX, molotovY, zoomLevel);
});

// Initialize the canvas and the map
window.onload = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redrawCanvas();
};

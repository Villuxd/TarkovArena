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
let drawings = []; // Array to store the drawings
let smokePosition = { x: 50, y: 300 }; // Initial position for smoke button
let fragPosition = { x: 150, y: 300 }; // Initial position for frag grenade
let flashPosition = { x: 250, y: 300 }; // Initial position for flashbang

// Utility image paths
const utilityImages = {
    smoke: 'images/smoke.png',
    frag: 'images/frag.png',
    flash: 'images/flash.png'
};

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
        redrawDrawings(); // Redraw all the previous drawings after map is loaded
        drawUtilities(); // Redraw all utilities (smoke, frag, flash)
    };
}

// Draw all utilities (smoke, frag, flash)
function drawUtilities() {
    drawUtility(smokePosition.x, smokePosition.y, 'smoke');
    drawUtility(fragPosition.x, fragPosition.y, 'frag');
    drawUtility(flashPosition.x, flashPosition.y, 'flash');
}

// Draw utility icons (smoke, frag, flash)
function drawUtility(x, y, type) {
    const img = new Image();
    img.src = utilityImages[type];
    img.onload = () => {
        ctx.drawImage(img, x, y, 50, 50); // Resizable icons (50x50 by default)
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

// Make the utility icons draggable
let isDragging = false;
let draggedUtility = null;
let offsetX, offsetY;

function makeUtilityDraggable(button, position) {
    button.addEventListener('mousedown', (e) => {
        isDragging = true;
        draggedUtility = button.id;
        offsetX = e.clientX - position.x;
        offsetY = e.clientY - position.y;

        const mouseMoveHandler = (e) => {
            if (isDragging) {
                position.x = e.clientX - offsetX;
                position.y = e.clientY - offsetY;
                button.style.left = position.x + 'px';
                button.style.top = position.y + 'px';
                loadMap(currentMap); // Redraw map and utilities
            }
        };

        const mouseUpHandler = () => {
            isDragging = false;
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });
}

// Initialize dragging for all utilities
makeUtilityDraggable(document.getElementById('smoke-btn'), smokePosition);
makeUtilityDraggable(document.getElementById('frag-btn'), fragPosition);
makeUtilityDraggable(document.getElementById('flash-btn'), flashPosition);

// Zoom In functionality using Mouse Wheel
canvas.addEventListener('wheel', (event) => {
    event.preventDefault(); // Prevent default scrolling behavior

    if (event.deltaY < 0) {
        scale += 0.1; // Zoom in
    } else if (event.deltaY > 0) {
        if (scale > 0.2) {  // Prevent zooming out too much
            scale -= 0.1; // Zoom out
        }
    }

    loadMap(currentMap); // Reload map with updated zoom scale
});

// Handle clear button
document.getElementById('clear-btn').addEventListener('click', () => {
    loadMap(currentMap); // Reload map to clear everything except map
    drawings = []; // Clear the drawings array
});

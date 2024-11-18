const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');

const maps = {
    fort: 'images/fort-map.png',
    skybridge: 'images/skybridge-map.png',
    bowl: 'images/bowl-map.png',
    bay5: 'images/bay5-map.png'
};

let currentMap = 'fort';
let drawing = false;
let currentTool = 'pencil'; 
let selectedUtility = null;
let eraseMode = false;
let drawingColor = "#FFFFFF";
let lineWidth = 5;
let dragUtility = null;  // Store the dragged utility icon

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
    ctx.arc(x, y, lineWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = drawingColor;
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

// Handle dragging utilities
document.querySelectorAll('.utility-btn').forEach(button => {
    button.addEventListener('dragstart', (e) => {
        dragUtility = e.target;
    });
});

canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
});

canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    if (dragUtility) {
        const x = e.offsetX;
        const y = e.offsetY;
        const utilityType = dragUtility.getAttribute('id').replace('-btn', '');
        drawUtility(x, y, utilityType);
    }
});

// Draw utility on canvas
function drawUtility(x, y, type) {
    const img = new Image();
    img.src = `images/${type}.png`; // Get the corresponding image
    img.onload = () => {
        ctx.drawImage(img, x - img.width / 2, y - img.height / 2);
    };
}

// Initial map load
loadMap(currentMap);

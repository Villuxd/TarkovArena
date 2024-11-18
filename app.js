const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let eraserMode = false;
let currentColor = '#ff0000';
let selectedMap = 'fort';

const maps = {
    fort: 'fort-map.jpg', // Replace with your actual map images
    skybridge: 'skybridge-map.jpg',
    bowl: 'bowl-map.jpg',
    bay5: 'bay5-map.jpg'
};

document.getElementById('map-selector').addEventListener('change', function() {
    selectedMap = this.value;
    loadMap(selectedMap);
});

document.getElementById('clear-btn').addEventListener('click', clearMap);
document.getElementById('eraser-btn').addEventListener('click', toggleEraser);
document.getElementById('color-picker').addEventListener('input', (e) => {
    currentColor = e.target.value;
});

document.querySelectorAll('.utility').forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
});

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);
canvas.addEventListener('dragover', (e) => e.preventDefault());
canvas.addEventListener('drop', placeUtility);

function loadMap(mapName) {
    const mapImage = new Image();
    mapImage.src = maps[mapName];
    mapImage.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
    };
}

function startDrawing(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineWidth = eraserMode ? 20 : 5;
    ctx.strokeStyle = eraserMode ? '#ffffff' : currentColor;
    ctx.lineCap = 'round';
    ctx.stroke();
}

function stopDrawing() {
    drawing = false;
}

function toggleEraser() {
    eraserMode = !eraserMode;
}

function handleDragStart(e) {
    e.dataTransfer.setData("text", e.target.id);
}

function placeUtility(e) {
    e.preventDefault();
    const utilityId = e.dataTransfer.getData("text");
    const posX = e.offsetX;
    const posY = e.offsetY;
    placeGrenade(utilityId, posX, posY);
}

function placeGrenade(grenadeId, x, y) {
    const radius = grenadeId === 'smoke' ? 100 : 0;  // Default smoke radius, change as necessary

    const utilityDiv = document.createElement('div');
    utilityDiv.classList.add('utility-radius');
    utilityDiv.style.width = `${radius * 2}px`;
    utilityDiv.style.height = `${radius * 2}px`;
    utilityDiv.style.left = `${x - radius}px`;
    utilityDiv.style.top = `${y - radius}px`;

    document.getElementById('map-container').appendChild(utilityDiv);
}

function clearMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loadMap(selectedMap);  // Re-load the selected map
    const utilityElements = document.querySelectorAll('.utility-radius');
    utilityElements.forEach(el => el.remove());
}

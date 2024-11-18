const canvas = document.getElementById('draw-canvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let eraserMode = false;
let currentColor = '#ff0000';

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

document.getElementById('eraser').addEventListener('click', () => {
    eraserMode = !eraserMode;
});

document.getElementById('color-picker').addEventListener('input', (event) => {
    currentColor = event.target.value;
});

document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelectorAll('.grenade-radius').forEach(el => el.remove());
});

// Drag and drop grenades (flashbang, smoke)
document.querySelectorAll('.grenade').forEach(item => {
    item.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData("text", event.target.id);
    });
});

canvas.addEventListener('dragover', (event) => {
    event.preventDefault();
});

canvas.addEventListener('drop', (event) => {
    event.preventDefault();
    const grenadeId = event.dataTransfer.getData("text");
    const grenade = document.getElementById(grenadeId);
    const posX = event.offsetX;
    const posY = event.offsetY;
    placeGrenade(grenadeId, posX, posY);
});

function startDrawing(event) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

function draw(event) {
    if (!drawing) return;
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.lineWidth = eraserMode ? 20 : 5;
    ctx.strokeStyle = eraserMode ? '#ffffff' : currentColor;
    ctx.lineCap = 'round';
    ctx.stroke();
}

function stopDrawing() {
    drawing = false;
}

function placeGrenade(grenadeId, x, y) {
    const radius = grenadeId === 'smoke' ? 100 : 0; // Example: 100px radius for smoke
    const circle = document.createElement('div');
    circle.classList.add('grenade-radius');
    circle.style.width = `${radius * 2}px`;
    circle.style.height = `${radius * 2}px`;
    circle.style.left = `${x - radius}px`;
    circle.style.top = `${y - radius}px`;
    document.body.appendChild(circle);
}

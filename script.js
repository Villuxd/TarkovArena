// Canvas and Context
const canvas = document.getElementById("map-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Variables
let currentMap = "images/fort-map.png"; // Default map
let drawColor = "#000000";
let drawThickness = 2;
let activeTool = "pencil"; // Default tool
let isDragging = false;
let isDrawing = false;
let startPos = { x: 0, y: 0 };
let panOffset = { x: 0, y: 0 };
let zoomScale = 1;
const mapImage = new Image();

// Load default map
mapImage.src = currentMap;
mapImage.onload = () => drawMap();

// Utility Drag-and-Drop
document.querySelectorAll(".utility").forEach((utility) => {
    utility.addEventListener("mousedown", (e) => {
        const img = new Image();
        img.src = utility.src;
        img.style.position = "absolute";
        img.style.left = e.clientX + "px";
        img.style.top = e.clientY + "px";
        img.classList.add("draggable");
        document.body.appendChild(img);

        const onMouseMove = (moveEvent) => {
            img.style.left = moveEvent.clientX + "px";
            img.style.top = moveEvent.clientY + "px";
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });
});

// Drawing
canvas.addEventListener("mousedown", (e) => {
    if (activeTool === "pencil") {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(
            (e.offsetX - panOffset.x) / zoomScale,
            (e.offsetY - panOffset.y) / zoomScale
        );
    } else if (activeTool === "hand") {
        isDragging = true;
        startPos = { x: e.offsetX, y: e.offsetY };
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (isDrawing && activeTool === "pencil") {
        ctx.lineTo(
            (e.offsetX - panOffset.x) / zoomScale,
            (e.offsetY - panOffset.y) / zoomScale
        );
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawThickness / zoomScale;
        ctx.stroke();
    } else if (isDragging && activeTool === "hand") {
        const dx = e.offsetX - startPos.x;
        const dy = e.offsetY - startPos.y;
        panOffset.x += dx;
        panOffset.y += dy;
        startPos = { x: e.offsetX, y: e.offsetY };
        drawMap();
    }
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    isDragging = false;
});

// Zoom functionality
canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1;
    const mouseX = (e.offsetX - panOffset.x) / zoomScale;
    const mouseY = (e.offsetY - panOffset.y) / zoomScale;

    zoomScale *= scaleAmount;
    zoomScale = Math.min(Math.max(zoomScale, 0.5), 2); // Limit zoom

    panOffset.x -= mouseX * (scaleAmount - 1) * zoomScale;
    panOffset.y -= mouseY * (scaleAmount - 1) * zoomScale;

    drawMap();
});

// Draw map
function drawMap() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.setTransform(zoomScale, 0, 0, zoomScale, panOffset.x, panOffset.y);
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
}

// Map Buttons
document.querySelectorAll(".map-button").forEach((button) => {
    button.addEventListener("click", () => {
        const mapId = button.id.split("-")[1];
        currentMap = `images/${mapId}-map.png`;
        mapImage.src = currentMap;
        mapImage.onload = () => drawMap();
    });
});

// Tool Selection
document.getElementById("hand-tool").addEventListener("click", () => {
    activeTool = "hand";
    canvas.style.cursor = "grab";
});

document.getElementById("pencil-tool").addEventListener("click", () => {
    activeTool = "pencil";
    canvas.style.cursor = "crosshair";
});

// Thickness Buttons
document.getElementById("small-thickness").addEventListener("click", () => drawThickness = 2);
document.getElementById("medium-thickness").addEventListener("click", () => drawThickness = 5);
document.getElementById("big-thickness").addEventListener("click", () => drawThickness = 8);

// Color Picker
document.getElementById("color-picker").addEventListener("input", (e) => {
    drawColor = e.target.value;
});

// Clear Button
document.getElementById("clear-button").addEventListener("click", () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
});

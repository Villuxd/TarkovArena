// Canvas and Context
const canvas = document.getElementById("map-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Variables
let currentMap = "images/fort-map.png"; // Default map
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let panOffset = { x: 0, y: 0 };
let zoomScale = 1;
let drawColor = "#000000";
let drawThickness = 2;
let activeTool = "pencil";
let mapImage = new Image();
let elements = [];

// Load initial map
mapImage.onload = () => {
    fitMapToCanvas();
};
mapImage.src = currentMap;

// Utility Drag-and-Drop
document.querySelectorAll(".utility").forEach(utility => {
    utility.addEventListener("mousedown", (e) => {
        const img = new Image();
        img.src = utility.src;
        const size = 30 * zoomScale; // Scale with zoom
        const element = {
            type: "utility",
            img,
            x: (e.offsetX - panOffset.x) / zoomScale,
            y: (e.offsetY - panOffset.y) / zoomScale,
            width: size,
            height: size,
        };
        elements.push(element);
        drawCanvas();
    });
});

// Map Buttons
document.querySelectorAll(".map-button").forEach(button => {
    button.addEventListener("click", () => {
        currentMap = `images/${button.id.split("-")[1]}-map.png`;
        mapImage.src = currentMap;
    });
});

// Drawing Tool
canvas.addEventListener("mousedown", (e) => {
    if (activeTool === "pencil") {
        const start = { x: (e.offsetX - panOffset.x) / zoomScale, y: (e.offsetY - panOffset.y) / zoomScale };
        const element = { type: "line", color: drawColor, thickness: drawThickness, points: [start] };
        elements.push(element);
        isDragging = true;
    } else if (activeTool === "hand") {
        isDragging = true;
        dragStart = { x: e.offsetX, y: e.offsetY };
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (activeTool === "pencil" && isDragging) {
        const current = { x: (e.offsetX - panOffset.x) / zoomScale, y: (e.offsetY - panOffset.y) / zoomScale };
        const element = elements[elements.length - 1];
        element.points.push(current);
        drawCanvas();
    } else if (activeTool === "hand" && isDragging) {
        panOffset.x += e.offsetX - dragStart.x;
        panOffset.y += e.offsetY - dragStart.y;
        dragStart = { x: e.offsetX, y: e.offsetY };
        drawCanvas();
    }
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
});

canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.01;
    zoomScale = Math.min(Math.max(zoomScale + zoomDelta, 0.5), 2);

    const cursorX = (e.offsetX - panOffset.x) / zoomScale;
    const cursorY = (e.offsetY - panOffset.y) / zoomScale;

    panOffset.x -= cursorX * zoomDelta;
    panOffset.y -= cursorY * zoomDelta;

    drawCanvas();
});

// Tool Buttons
document.getElementById("hand-tool").addEventListener("click", () => {
    activeTool = "hand";
    canvas.style.cursor = "grab";
});

document.getElementById("pencil-tool").addEventListener("click", () => {
    activeTool = "pencil";
    canvas.style.cursor = "crosshair";
});

document.getElementById("small-thickness").addEventListener("click", () => drawThickness = 2);
document.getElementById("medium-thickness").addEventListener("click", () => drawThickness = 5);
document.getElementById("big-thickness").addEventListener("click", () => drawThickness = 8);

document.getElementById("color-picker").addEventListener("input", (e) => drawColor = e.target.value);
document.getElementById("clear-button").addEventListener("click", () => {
    elements = [];
    drawCanvas();
});

// Helper Functions
function fitMapToCanvas() {
    panOffset.x = 0;
    panOffset.y = 0;
    zoomScale = 1;
    drawCanvas();
}

function drawCanvas() {
    ctx.setTransform(zoomScale, 0, 0, zoomScale, panOffset.x, panOffset.y);
    ctx.clearRect(-panOffset.x, -panOffset.y, canvas.width / zoomScale, canvas.height / zoomScale);
    ctx.drawImage(mapImage, 0, 0, canvas.width / zoomScale, canvas.height / zoomScale);
    elements.forEach(element => {
        if (element.type === "utility") {
            ctx.drawImage(element.img, element.x, element.y, element.width, element.height);
        } else if (element.type === "line") {
            ctx.strokeStyle = element.color;
            ctx.lineWidth = element.thickness / zoomScale;
            ctx.beginPath();
            element.points.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.stroke();
        }
    });
}

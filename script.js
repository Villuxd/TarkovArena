// Canvas and Context
const canvas = document.getElementById("map-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Variables
let currentMap = "images/fort.png"; // Default map
let isDrawing = false;
let drawColor = "#000000";
let drawThickness = 2;
let activeTool = "pencil"; // Default tool
let panOffset = { x: 0, y: 0 };
let startPos = null;

// Utility Drag-and-Drop
document.querySelectorAll(".utility").forEach(utility => {
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
    if (activeTool !== "pencil") return;
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", (e) => {
    if (isDrawing && activeTool === "pencil") {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawThickness;
        ctx.stroke();
    }
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});

// Map Buttons
const mapButtons = document.querySelectorAll(".map-button");
mapButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentMap = `images/${button.id.split("-")[1]}.png`;
        const mapImage = new Image();
        mapImage.onload = () => ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
        mapImage.src = currentMap;
    });
});

// Hand Tool
document.getElementById("hand-tool").addEventListener("click", () => {
    activeTool = "hand";
    canvas.style.cursor = "grab";
});

// Pencil Tool
document.getElementById("pencil-tool").addEventListener("click", () => {
    activeTool = "pencil";
    canvas.style.cursor = "crosshair";
});

// Thickness
document.getElementById("small-thickness").addEventListener("click", () => drawThickness = 2);
document.getElementById("medium-thickness").addEventListener("click", () => drawThickness = 5);
document.getElementById("big-thickness").addEventListener("click", () => drawThickness = 8);

// Color Picker
document.getElementById("color-picker").addEventListener("input", (e) => {
    drawColor = e.target.value;
});

// Clear Button
document.getElementById("clear-button").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Zoom
let zoomScale = 1;
canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoomScale += e.deltaY * -0.01;
    zoomScale = Math.min(Math.max(zoomScale, 0.5), 2); // Limit zoom
    ctx.setTransform(zoomScale, 0, 0, zoomScale, 0, 0);
    const mapImage = new Image();
    mapImage.src = currentMap;
    mapImage.onload = () => ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
});

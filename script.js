// Canvas and Context
const canvas = document.getElementById("map-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Variables
let currentMap = "images/fort-map.png"; // Default map
let isDrawing = false;
let drawColor = "#000000";
let drawThickness = 2;
let activeTool = "pencil"; // Default tool
let panOffset = { x: 0, y: 0 };
let startPos = null;
let zoomScale = 1;
let mapImage = new Image();
let zoomOrigin = { x: 0, y: 0 }; // Zoom origin to track the zoom's center

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
        currentMap = `images/${button.id.split("-")[1]}-map.png`;
        loadMapImage();
    });
});

// Load map image
function loadMapImage() {
    mapImage = new Image();
    mapImage.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawing
        ctx.setTransform(zoomScale, 0, 0, zoomScale, panOffset.x, panOffset.y); // Apply zoom and pan
        ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
    };
    mapImage.src = currentMap;
}

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
    loadMapImage(); // Reload map to clear all elements
});

// Zoom and Pan functionality
canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    let zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    zoomScale *= zoomFactor;

    // Ensure zoom level stays within a reasonable range
    zoomScale = Math.max(0.5, Math.min(zoomScale, 2));

    // Get the mouse position relative to the canvas
    zoomOrigin = {
        x: e.offsetX / canvas.width,
        y: e.offsetY / canvas.height
    };

    loadMapImage();
});

canvas.addEventListener("mousemove", (e) => {
    if (activeTool === "hand" && e.buttons === 1) {
        panOffset.x += e.movementX;
        panOffset.y += e.movementY;
        loadMapImage();
    }
});

// Initial map load
loadMapImage();

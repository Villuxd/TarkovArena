// Canvas and Context
const canvas = document.getElementById("map-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Variables
let currentMap = "images/fort-map.png"; // Default map
let isDrawing = false;
let drawColor = "#000000";
let drawThickness = 2; // Default thickness
let activeTool = "pencil"; // Default tool
let mapImage = new Image();
let panOffset = { x: 0, y: 0 }; // Panning offset
let zoomScale = 1; // Zoom level
let startPos = null; // Start position for dragging

// Function to load and draw the map image
function loadMapImage(mapPath) {
    mapImage = new Image();
    mapImage.onload = () => {
        // Ensure the map is drawn at the correct position
        drawMap();
    };
    mapImage.src = mapPath;
}

// Function to draw the map with pan and zoom
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(zoomScale, 0, 0, zoomScale, panOffset.x, panOffset.y);
    ctx.drawImage(mapImage, 0, 0, mapImage.width, mapImage.height);
}

// Initial map load
loadMapImage(currentMap);

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
    ctx.moveTo((e.offsetX - panOffset.x) / zoomScale, (e.offsetY - panOffset.y) / zoomScale);
});

canvas.addEventListener("mousemove", (e) => {
    if (isDrawing && activeTool === "pencil") {
        ctx.lineTo((e.offsetX - panOffset.x) / zoomScale, (e.offsetY - panOffset.y) / zoomScale);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawThickness / zoomScale;
        ctx.stroke();
    }
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});

// Map Buttons
document.querySelectorAll(".map-button").forEach(button => {
    button.addEventListener("click", () => {
        currentMap = `images/${button.id.split("-")[1]}-map.png`;
        loadMapImage(currentMap);
    });
});

// Hand Tool (for panning)
canvas.addEventListener("mousedown", (e) => {
    if (activeTool !== "hand") return;
    startPos = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    canvas.style.cursor = "grabbing";
});

canvas.addEventListener("mousemove", (e) => {
    if (!startPos) return;

    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;

    panOffset.x = dx;
    panOffset.y = dy;

    // Prevent panning out of bounds
    panOffset.x = Math.min(Math.max(panOffset.x, canvas.width - mapImage.width * zoomScale), 0);
    panOffset.y = Math.min(Math.max(panOffset.y, canvas.height - mapImage.height * zoomScale), 0);

    drawMap();
});

canvas.addEventListener("mouseup", () => {
    startPos = null;
    canvas.style.cursor = "grab";
});

// Pencil Tool
document.getElementById("pencil-tool").addEventListener("click", () => {
    activeTool = "pencil";
    canvas.style.cursor = "crosshair";
});

// Thickness Buttons
document.getElementById("small-thickness").addEventListener("click", () => drawThickness = 2);
document.getElementById("medium-thickness").addEventListener("click", () => drawThickness = 5);
document.getElementById("large-thickness").addEvent

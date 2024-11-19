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
let panOffset = { x: 0, y: 0 }; // For panning
let zoomScale = 1; // Default zoom level
let startPos = null; // Start position for panning

// Function to load and draw the map image
function loadMapImage(mapPath) {
    mapImage = new Image();
    mapImage.onload = () => {
        // Ensure the map is drawn at the correct position with the correct zoom
        drawMap();
    };
    mapImage.src = mapPath;
}

// Function to draw the map with pan and zoom applied
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing new map

    const mapWidth = mapImage.width * zoomScale;
    const mapHeight = mapImage.height * zoomScale;

    // Apply pan offset and zoom scale when drawing the image
    ctx.setTransform(zoomScale, 0, 0, zoomScale, panOffset.x, panOffset.y);
    ctx.drawImage(mapImage, 0, 0, mapWidth, mapHeight); // Draw the map image with zoom and pan
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
        loadMapImage(currentMap); // Load the selected map
    });
});

// Hand Tool (for panning)
canvas.addEventListener("mousedown", (e) => {
    if (activeTool !== "hand") return;

    startPos = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    canvas.style.cursor = "grabbing";
});

canvas.addEventListener("mousemove", (e) => {
    if (startPos) {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;

        panOffset = { x: dx, y: dy };
        drawMap(); // Redraw the map after panning
    }
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

// Thickness Icons
document.getElementById("small-thickness").addEventListener("click", () => {
    drawThickness = 2; // Small thickness
});

document.getElementById("medium-thickness").addEventListener("click", () => {
    drawThickness = 5; // Medium thickness
});

document.getElementById("large-thickness").addEventListener("click", () => {
    drawThickness = 8; // Large thickness
});

// Color Picker
document.getElementById("color-picker").addEventListener("input", (e) => {
    drawColor = e.target.value;
});

// Clear Button
document.getElementById("clear-button").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loadMapImage(currentMap); // Reload the map after clearing
});

// Zoom
canvas.addEventListener("wheel", (e) => {
    e.preventDefault();

    // Calculate zoom scale based on the direction of scroll
    zoomScale += e.deltaY * -0.01;
    zoomScale = Math.min(Math.max(zoomScale, 0.5), 2); // Limit zoom

    // Calculate the mouse position relative to the canvas
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Adjust the panOffset to zoom towards the mouse position
    panOffset.x -= (mouseX - panOffset.x) * (1 - zoomScale);
    panOffset.y -= (mouseY - panOffset.y) * (1 - zoomScale);

    // Redraw the map after zoom
    drawMap();
});

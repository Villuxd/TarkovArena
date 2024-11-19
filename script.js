// script.js
const canvas = document.getElementById("map-canvas");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let currentTool = "pencil";
let currentColor = "#ff0000";
let currentThickness = 5;
let currentZoom = 1;
let mapImage = new Image();
let mapOffsetX = 0;
let mapOffsetY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let utilities = [];

canvas.width = 800;
canvas.height = 600;

const maps = {
    fort: "images/fort-map.png",
    skybridge: "images/skybridge-map.png",
    bowl: "images/bowl-map.png",
    bay5: "images/bay5-map.png",
};

let selectedMap = "fort";
loadMap(maps[selectedMap]);

// Load Map Image
function loadMap(src) {
    mapImage.src = src;
    mapImage.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mapImage, mapOffsetX, mapOffsetY, mapImage.width * currentZoom, mapImage.height * currentZoom);
        drawUtilities(); // Redraw utilities after map load
    };
}

// Zooming
canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    const zoomAmount = 0.1;
    if (event.deltaY < 0) {
        currentZoom += zoomAmount;
    } else {
        currentZoom -= zoomAmount;
        if (currentZoom < 0.2) currentZoom = 0.2;
    }
    loadMap(maps[selectedMap]);
});

// Hand Tool
document.getElementById("hand-tool").addEventListener("click", () => {
    currentTool = "hand";
});

// Pencil Tool
document.getElementById("pencil-tool").addEventListener("click", () => {
    currentTool = "pencil";
});

canvas.addEventListener("mousedown", (event) => {
    if (currentTool === "hand") {
        isDragging = true;
        dragStartX = event.offsetX - mapOffsetX;
        dragStartY = event.offsetY - mapOffsetY;
    } else if (currentTool === "pencil") {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    }
});

canvas.addEventListener("mousemove", (event) => {
    if (isDragging) {
        mapOffsetX = event.offsetX - dragStartX;
        mapOffsetY = event.offsetY - dragStartY;
        loadMap(maps[selectedMap]);
    } else if (isDrawing) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentThickness;
        ctx.stroke();
    }
});

canvas.addEventListener("mouseup", () => {
    if (isDrawing) {
        isDrawing = false;
    } else if (isDragging) {
        isDragging = false;
    }
});

// Map Selection
document.getElementById("map-fort").addEventListener("click", () => {
    selectedMap = "fort";
    loadMap(maps[selectedMap]);
});
document.getElementById("map-skybridge").addEventListener("click", () => {
    selectedMap = "skybridge";
    loadMap(maps[selectedMap]);
});
document.getElementById("map-bowl").addEventListener("click", () => {
    selectedMap = "bowl";
    loadMap(maps[selectedMap]);
});
document.getElementById("map-bay5").addEventListener("click", () => {
    selectedMap = "bay5";
    loadMap(maps[selectedMap]);
});

// Thickness and Color Picker
document.getElementById("small-thickness").addEventListener("click", () => {
    currentThickness = 5;
});
document.getElementById("medium-thickness").addEventListener("click", () => {
    currentThickness = 10;
});
document.getElementById("big-thickness").addEventListener("click", () => {
    currentThickness = 15;
});

document.getElementById("color-picker").addEventListener("input", (event) => {
    currentColor = event.target.value;
});

// Clear All Drawings and Utilities
document.getElementById("clear-button").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loadMap(maps[selectedMap]);
    utilities = [];
});

// Place Utilities (Smoke, Molotov, etc.)
document.getElementById("smoke-icon").addEventListener("click", () => {
    currentTool = "smoke";
});
document.getElementById("molotov-icon").addEventListener("click", () => {
    currentTool = "molotov";
});
document.getElementById("flash-icon").addEventListener("click", () => {
    currentTool = "flash";
});
document.getElementById("frag-icon").addEventListener("click", () => {
    currentTool = "frag";
});

// Utility Placement on Canvas
canvas.addEventListener("click", (event) => {
    if (currentTool === "smoke") {
        placeUtility(event.offsetX, event.offsetY, "smoke");
    } else if (currentTool === "molotov") {
        placeUtility(event.offsetX, event.offsetY, "molotov");
    } else if (currentTool === "flash") {
        placeUtility(event.offsetX, event.offsetY, "flash");
    } else if (currentTool === "frag") {
        placeUtility(event.offsetX, event.offsetY, "frag");
    }
});

// Utility Drawing
function placeUtility(x, y, type) {
    utilities.push({ x, y, type });
    drawUtilities();
}

// Draw Utilities on Canvas
function drawUtilities() {
    utilities.forEach((utility) => {
        let radius = 30 * currentZoom; // Scale the utility icon with zoom
        if (utility.type === "smoke") {
            ctx.beginPath();
            ctx.arc(utility.x, utility.y, radius, 0, Math.PI * 2, false);
            ctx.fillStyle = "rgba(100, 100, 100, 0.3)";
            ctx.fill();
        } else if (utility.type === "molotov") {
            ctx.beginPath();
            ctx.arc(utility.x, utility.y, radius, 0, Math.PI * 2, false);
            ctx.fillStyle = "rgba(255, 69, 0, 0.6)";
            ctx.fill();
        } else if (utility.type === "flash") {
            ctx.beginPath();
            ctx.arc(utility.x, utility.y, radius, 0, Math.PI * 2, false);
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            ctx.fill();
        } else if (utility.type === "frag") {
            ctx.beginPath();
            ctx.arc(utility.x, utility.y, radius, 0, Math.PI * 2, false);
            ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
            ctx.fill();
        }
    });
}

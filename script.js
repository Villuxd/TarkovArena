// JavaScript (script.js)
const canvas = document.getElementById("map-canvas");
const ctx = canvas.getContext("2d");
const mapImages = {
    fort: "images/fort-map.png",
    skybridge: "images/skybridge-map.png",
    bowl: "images/bowl-map.png",
    bay5: "images/bay5-map.png"
};

let currentMap = "fort";
let zoomLevel = 1;
let offsetX = 0;
let offsetY = 0;
let isDrawing = false;
let tool = "hand";
let currentColor = "#FFFFFF";
let thickness = 5;
let utilities = [];

const loadImage = (src) => {
    const img = new Image();
    img.src = src;
    return img;
};

const mapImage = loadImage(mapImages[currentMap]);
mapImage.onload = () => {
    drawMap();
};

// Draw the map image
function drawMap() {
    const width = mapImage.width * zoomLevel;
    const height = mapImage.height * zoomLevel;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, offsetX, offsetY, width, height);
    drawUtilities();
}

// Draw all utilities on the map
function drawUtilities() {
    utilities.forEach((utility) => {
        ctx.drawImage(utility.image, utility.x, utility.y, utility.size, utility.size);
    });
}

// Add utility (e.g., grenade, pencil drawing, etc.)
function addUtility(x, y, image, size) {
    utilities.push({
        x,
        y,
        image,
        size
    });
}

// Handle mouse events for map dragging and zooming
canvas.addEventListener("mousedown", (e) => {
    if (tool === "hand") {
        isDrawing = false;
        offsetX = e.clientX - canvas.offsetLeft;
        offsetY = e.clientY - canvas.offsetTop;
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (tool === "hand" && isDrawing === false) {
        const dx = e.clientX - canvas.offsetLeft - offsetX;
        const dy = e.clientY - canvas.offsetTop - offsetY;
        offsetX += dx;
        offsetY += dy;
        drawMap();
    }
});

canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    let zoomDelta = e.deltaY < 0 ? zoomFactor : -zoomFactor;
    zoomLevel += zoomDelta;
    zoomLevel = Math.max(0.5, Math.min(zoomLevel, 3)); // Restrict zoom level

    drawMap();
});

// Zoom in/out with mouse cursor
canvas.addEventListener("wheel", (e) => {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;
    const zoomFactor = 0.1;
    let zoomDelta = e.deltaY < 0 ? zoomFactor : -zoomFactor;
    zoomLevel += zoomDelta;
    zoomLevel = Math.max(0.5, Math.min(zoomLevel, 3)); // Restrict zoom level

    const scaleX = (mouseX - offsetX) * zoomDelta;
    const scaleY = (mouseY - offsetY) * zoomDelta;

    offsetX -= scaleX;
    offsetY -= scaleY;

    drawMap();
});

// Set utility image and handle placement on canvas
function setUtility(toolType) {
    let utilityImage;
    switch (toolType) {
        case "flash":
            utilityImage = loadImage("images/flash-icon.png");
            break;
        case "smoke":
            utilityImage = loadImage("images/smoke-radius.png"); // Smoke radius
            break;
        case "molotov":
            utilityImage = loadImage("images/molotov-radius.png"); // Molotov radius
            break;
        default:
            return;
    }

    return utilityImage;
}

// Handle placing the utilities on the map
canvas.addEventListener("click", (e) => {
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    if (tool === "flash" || tool === "smoke" || tool === "molotov") {
        const size = 40; // Example size, can be adjusted based on zoom
        const utilityImage = setUtility(tool);
        addUtility(x - size / 2, y - size / 2, utilityImage, size);
        drawMap();
    }
});

// Set tool to pencil or hand
document.getElementById("hand-tool").addEventListener("click", () => {
    tool = "hand";
});

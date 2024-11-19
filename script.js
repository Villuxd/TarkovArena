const canvas = document.getElementById("map-canvas");
const ctx = canvas.getContext("2d");

const mapImages = {
    fort: "images/fort-map.png",
    skybridge: "images/skybridge-map.png",
    bowl: "images/bowl-map.png",
    bay5: "images/bay5-map.png"
};

let currentMap = "fort"; // Default map
let mapImage = new Image();
mapImage.src = mapImages[currentMap];

let drawing = false;
let tool = "pencil";
let color = "#ffffff";
let thickness = 5;
let currentMapOffsetX = 0;
let currentMapOffsetY = 0;
let zoomFactor = 1;

const utilities = {
    flash: { x: 100, y: 100, width: 20, height: 20 },
    smoke: { x: 200, y: 200, width: 30, height: 30 },
    molotov: { x: 300, y: 300, width: 30, height: 30 },
    frag: { x: 400, y: 400, width: 20, height: 20 }
};

// Draw the map image
function drawMap() {
    const scaledWidth = mapImage.width * zoomFactor;
    const scaledHeight = mapImage.height * zoomFactor;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, currentMapOffsetX, currentMapOffsetY, scaledWidth, scaledHeight);
}

// Draw utilities and thicknesses
function drawUtilities() {
    ctx.fillStyle = color;
    for (const key in utilities) {
        const utility = utilities[key];
        ctx.beginPath();
        ctx.arc(utility.x, utility.y, utility.width * zoomFactor, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Set tool
function setTool(newTool) {
    tool = newTool;
}

// Set thickness
function setThickness(newThickness) {
    thickness = newThickness;
}

// Set color
function setColor(newColor) {
    color = newColor;
}

// Zoom the map
function zoomMap(factor) {
    zoomFactor += factor;
    zoomFactor = Math.max(0.1, zoomFactor); // Prevent zooming out too much
    zoomFactor = Math.min(5, zoomFactor); // Prevent zooming in too much
    drawMap();
}

// Pan the map
function panMap(dx, dy) {
    currentMapOffsetX += dx;
    currentMapOffsetY += dy;
    drawMap();
}

canvas.addEventListener("mousedown", (e) => {
    if (tool === "pencil") {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (drawing && tool === "pencil") {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
    }
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
});

canvas.addEventListener("wheel", (e) => {
    const zoomIn = e.deltaY < 0;
    if (zoomIn) {
        zoomMap(0.1);
    } else {
        zoomMap(-0.1);
    }
});

// Button Event Listeners
document.getElementById("map-fort").addEventListener("click", () => {
    currentMap = "fort";
    mapImage.src = mapImages[currentMap];
    drawMap();
});

document.getElementById("map-skybridge").addEventListener("click", () => {
    currentMap = "skybridge";
    mapImage.src = mapImages[currentMap];
    drawMap();
});

document.getElementById("map-bowl").addEventListener("click", () => {
    currentMap = "bowl";
    mapImage.src = mapImages[currentMap];
    drawMap();
});

document.getElementById("map-bay5").addEventListener("click", () => {
    currentMap = "bay5";
    mapImage.src = mapImages[currentMap];
    drawMap();
});

document.getElementById("hand-tool").addEventListener("click", () => {
    setTool("hand");
});

document.getElementById("pencil-tool").addEventListener("click", () => {
    setTool("pencil");
});

document.getElementById("small-thickness").addEventListener("click", () => {
    setThickness(2);
});

document.getElementById("medium-thickness").addEventListener("click", () => {
    setThickness(5);
});

document.getElementById("big-thickness").addEventListener("click", () => {
    setThickness(10);
});

document.getElementById("clear-button").add

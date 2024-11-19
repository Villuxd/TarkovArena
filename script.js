const canvas = document.getElementById("map-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let currentMap = "images/fort-map.png"; // Default map
let isDrawing = false;
let drawColor = "#000000";
let drawThickness = 2;
let activeTool = "pencil"; // Default tool
let panOffset = { x: 0, y: 0 };
let startPos = null;

let zoomScale = 1;
let zoomOffset = { x: 0, y: 0 };
let isDragging = false;
let dragStart = { x: 0, y: 0 };

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

canvas.addEventListener("mousedown", (e) => {
    if (activeTool === "hand" && !isDrawing) {
        isDragging = true;
        dragStart.x = e.offsetX - zoomOffset.x;
        dragStart.y = e.offsetY - zoomOffset.y;
        canvas.style.cursor = "grabbing";
    } else if (activeTool === "pencil") {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (isDrawing && activeTool === "pencil") {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawThickness;
        ctx.stroke();
    }

    if (isDragging) {
        zoomOffset.x = e.offsetX - dragStart.x;
        zoomOffset.y = e.offsetY - dragStart.y;
        redrawMap();
    }
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    isDragging = false;
    canvas.style.cursor = "grab";
});

const mapButtons = document.querySelectorAll(".map-button");
mapButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentMap = `images/${button.id.split("-")[1]}-map.png`;
        redrawMap();
    });
});

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

document.getElementById("color-picker").addEventListener("input", (e) => {
    drawColor = e.target.value;
});

document.getElementById("clear-button").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redrawMap();
});

canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoomScale += e.deltaY * -0.01;
    zoomScale = Math.min(Math.max(zoomScale, 0.5), 2); // Limit zoom
    redrawMap();
});

function redrawMap() {
    const mapImage = new Image();
    mapImage.src = currentMap;
    mapImage.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(zoomScale, 0, 0, zoomScale, zoomOffset.x, zoomOffset.y);
        ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
    };
}

function resizeUtilityIcon(img) {
    img.style.width = `${img.width * zoomScale}px`;
    img.style.height = `${img.height * zoomScale}px`;
}

function redrawUtilityIcons() {
    document.querySelectorAll(".utility").forEach(icon => {
        const img = new Image();
        img.src = icon.src;
        img.onload = () => resizeUtilityIcon(img);
    });
}

// To fix the issue when zooming out or in, we ensure the icons scale correctly.
canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoomScale += e.deltaY * -0.01;
    zoomScale = Math.min(Math.max(zoomScale, 0.5), 2); // Limit zoom
    redrawMap();
    redrawUtilityIcons();
});

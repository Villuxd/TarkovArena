const canvas = document.getElementById("map-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let currentMap = "images/fort-map.png";
let drawColor = "#000000";
let drawThickness = 2;
let activeTool = "pencil";
let isDragging = false;
let isDrawing = false;
let draggingUtility = null;
let startPos = { x: 0, y: 0 };
let panOffset = { x: 0, y: 0 };
let zoomScale = 1;
const mapImage = new Image();
const drawings = [];
const utilities = [];

mapImage.src = currentMap;
mapImage.onload = () => drawMap();

// Set up the utility buttons
document.querySelectorAll(".utility").forEach((utility) => {
    utility.addEventListener("mousedown", (e) => {
        const img = new Image();
        img.src = utility.src;

        const worldX = (e.offsetX - panOffset.x) / zoomScale;
        const worldY = (e.offsetY - panOffset.y) / zoomScale;

        if (utility.id === "smoke-icon") {
            utilities.push({ type: "smoke", x: worldX, y: worldY, radius: 100 });
        } else if (utility.id === "molotov-icon") {
            utilities.push({ type: "molotov", x: worldX, y: worldY, radius: 80 });
        } else {
            utilities.push({ type: "icon", img, x: worldX, y: worldY });
        }

        drawMap();
    });
});

// Handle the canvas mouse events
canvas.addEventListener("mousedown", (e) => {
    const mouseX = (e.offsetX - panOffset.x) / zoomScale;
    const mouseY = (e.offsetY - panOffset.y) / zoomScale;

    utilities.forEach((utility) => {
        if (utility.type === "icon") {
            const size = 30 / zoomScale;
            if (
                mouseX >= utility.x &&
                mouseX <= utility.x + size &&
                mouseY >= utility.y &&
                mouseY <= utility.y + size
            ) {
                draggingUtility = utility;
            }
        }
    });

    if (activeTool === "pencil" && !draggingUtility) {
        isDrawing = true;
        drawings.push({
            tool: "pencil",
            color: drawColor,
            thickness: drawThickness,
            points: [{ x: mouseX, y: mouseY }]
        });
    } else if (activeTool === "hand" && !draggingUtility) {
        isDragging = true;
        startPos = { x: e.offsetX, y: e.offsetY };
    }
});

canvas.addEventListener("mousemove", (e) => {
    const mouseX = (e.offsetX - panOffset.x) / zoomScale;
    const mouseY = (e.offsetY - panOffset.y) / zoomScale;

    if (isDrawing) {
        const currentDrawing = drawings[drawings.length - 1];
        currentDrawing.points.push({ x: mouseX, y: mouseY });
        drawMap();
    } else if (isDragging) {
        const dx = e.offsetX - startPos.x;
        const dy = e.offsetY - startPos.y;

        panOffset.x += dx;
        panOffset.y += dy;
        constrainPanOffset();
        startPos = { x: e.offsetX, y: e.offsetY };
        drawMap();
    } else if (draggingUtility) {
        draggingUtility.x = mouseX;
        draggingUtility.y = mouseY;
        drawMap();
    }
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    isDragging = false;
    draggingUtility = null;
});

// Zooming functionality
canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1;
    const mouseX = (e.offsetX - panOffset.x) / zoomScale;
    const mouseY = (e.offsetY - panOffset.y) / zoomScale;

    zoomScale *= scaleAmount;
    zoomScale = Math.min(Math.max(zoomScale, 0.5), 2);

    panOffset.x -= mouseX * (scaleAmount - 1) * zoomScale;
    panOffset.y -= mouseY * (scaleAmount - 1) * zoomScale;
    constrainPanOffset();
    drawMap();
});

function constrainPanOffset() {
    const scaledWidth = canvas.width * zoomScale;
    const scaledHeight = canvas.height * zoomScale;

    panOffset.x = Math.min(0, Math.max(panOffset.x, canvas.width - scaledWidth));
    panOffset.y = Math.min(0, Math.max(panOffset.y, canvas.height - scaledHeight));
}

function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoomScale, zoomScale);
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

    // Draw the utilities (smoke, molotov, icons)
    utilities.forEach((utility) => {
        if (utility.type === "smoke") {
            ctx.beginPath();
            ctx.arc(utility.x, utility.y, utility.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
            ctx.fill();
        } else if (utility.type === "molotov") {
            ctx.beginPath();
            ctx.arc(utility.x, utility.y, utility.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 140, 0, 0.5)";
            ctx.fill();
        } else if (utility.type === "icon") {
            const size = 30 / zoomScale;
            ctx.drawImage(utility.img, utility.x, utility.y, size, size);
        }
    });

    // Draw the pencil tool's drawings
    drawings.forEach((drawing) => {
        ctx.beginPath();
        ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
        drawing.points.forEach((point) => {
            ctx.lineTo(point.x, point.y);
        });
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.thickness;
        ctx.stroke();
    });

    ctx.restore();
}

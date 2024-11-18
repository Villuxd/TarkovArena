const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');

const maps = {
    fort: 'images/fort-map.png',
    skybridge: 'images/skybridge-map.png',
    bowl: 'images/bowl-map.png',
    bay5: 'images/bay5-map.png'
};

let currentMap = 'fort'; // Default map
let drawing = false;
let currentTool = 'pencil'; // Default tool
let selectedUtility = null; // To store selected utility
let eraseMode = false; // Eraser flag
let zoomLevel = 1; // Initial zoom level
let thickness = 5; // Default thickness of drawing

// Load map into canvas
function loadMap(mapName) {
    const mapImage = new Image();
    mapImage.src = maps[mapName];
    mapImage.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
        const ratio = Math.min(canvas.width / mapImage.width, canvas.height / mapImage.height) * zoomLevel;
        const width = mapImage.width * ratio;
        const height = mapImage.height * ratio;
        ctx.drawImage(mapImage, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height); // Center the image
    };
}

// Handle map selection
document.querySelectorAll('.map-select').forEach(button => {
    button.addEventListener('click', (event) => {
        const mapName = event.target.getAttribute('data-map');
        currentMap = mapName;
        loadMap(currentMap);
    });
});

// Draw on canvas
canvas.addEventListener('mousedown', (e) => {
    if (currentTool === 'pencil' && !eraseMode) {
        drawing = true;
        draw(e);
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (drawing && currentTool === 'pencil' && !eraseMode) {
        draw(e);
    }
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
});

// Drawing function with thickness
function draw(e) {
    if (!drawing) return;

    const x = e.offsetX;
    const y = e.offsetY;

    ctx.beginPath();
    ctx.arc(x, y, thickness, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF"; // Default white color for drawing
    ctx.fill();
}

// Handle clear button
document.getElementById('clear-btn').addEventListener('click', () => {
    loadMap(currentMap); // Reload map to clear everything except map
});

// Handle eraser tool
document.getElementById('eraser-btn').addEventListener('click', () => {
    eraseMode = !eraseMode;
    currentTool = eraseMode ? 'eraser' : 'pencil';
    document.getElementById('eraser-btn').style.backgroundColor = eraseMode ? '#9a3c9f' : '#6c2b8e';
});

// Utility buttons (Flash, Smoke, Molotov, Frag)
document.querySelectorAll('.utility-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        selectedUtility = e.target.getAttribute('data-utility');
    });
});

// Draw utility (Smoke, Flash, Frag, Molotov)
canvas.addEventListener('click', (e) => {
    if (selectedUtility) {
        const x = e.offsetX;
        const y = e.offsetY;

        if (selectedUtility === 'flash') {
            const flashIcon = new Image();
            flashIcon.src = 'images/flash.png';
            flashIcon.onload = () => {
                ctx.drawImage(flashIcon, x - 15, y - 15, 30, 30); // Adjust size as needed
            };
        } else if (selectedUtility === 'smoke') {
            const smokeIcon = new Image();
            smokeIcon.src = 'images/smoke.png';
            smokeIcon.onload = () => {
                ctx.drawImage(smokeIcon, x - 15, y - 15, 30, 30);
            };
        } else if (selectedUtility === 'molotov') {
            const molotovIcon = new Image();
            molotovIcon.src = 'images/molotov.png';
            molotovIcon.onload = () => {
                ctx.drawImage(molotovIcon, x - 15, y - 15, 30, 30);
            };
        } else if (selectedUtility === 'frag') {
            const fragIcon = new Image();
            fragIcon.src = 'images/frag.png';
            fragIcon.onload = () => {
                ctx.drawImage(fragIcon, x - 15, y - 15, 30, 30);
            };
        }
    }
});

// Mousewheel zoom functionality
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
        zoomLevel += 0.1;
    } else {
        zoomLevel = Math.max(0.5, zoomLevel - 0.1);
    }
    loadMap(currentMap);
});

// Handle drawing thickness change
document.querySelectorAll('.thickness-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        thickness = parseInt(e.target.getAttribute('data-thickness'));
    });
});

// Color selection for drawing
document.querySelectorAll('.color-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        ctx.fillStyle = e.target.getAttribute('data-color');
    });
});

// Initial map load
loadMap(currentMap);

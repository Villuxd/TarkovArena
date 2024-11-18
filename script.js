const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');

// Utility definitions
const utilities = {
    flash: { src: 'images/flash.png', x: 0, y: 0, width: 50, height: 50 },
    smoke: { src: 'images/smoke.png', x: 0, y: 0, width: 50, height: 50, radius: 50 },
    molotov: { src: 'images/molotov.png', x: 0, y: 0, width: 50, height: 50 },
    frag: { src: 'images/frag.png', x: 0, y: 0, width: 50, height: 50 }
};

let currentUtility = null;
let currentMap = 'fort'; // Default map
let drawing = false;
let currentTool = 'pencil'; // Default tool
let selectedColor = '#FFFFFF'; // Default color
let lineThickness = 5; // Default line thickness

// Load the map into the canvas
function loadMap(mapName) {
    const mapImage = new Image();
    mapImage.src = `images/${mapName}-map.png`;
    mapImage.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
        const ratio = Math.min(canvas.width / mapImage.width, canvas.height / mapImage.height);
        const width = mapImage.width * ratio;
        const height = mapImage.height * ratio;
        ctx.drawImage(mapImage, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height); // Center the image
    };
}

// Utility button event listener to select utilities
document.querySelectorAll('.utility-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const utilityName = e.target.id.replace('-btn', '');
        currentUtility = utilities[utilityName];
    });
});

// Color selection event listeners
document.getElementById('color-red').addEventListener('click', () => {
    selectedColor = '#FF0000';
});
document.getElementById('color-green').addEventListener('click', () => {
    selectedColor = '#00FF00';
});
document.getElementById('color-blue').addEventListener('click', () => {
    selectedColor = '#0000FF';
});

// Thickness selection event listeners
document.getElementById('small-thickness').addEventListener('click', () => {
    lineThickness = 5;
});
document.getElementById('medium-thickness').addEventListener('click', () => {
    lineThickness = 10;
});
document.getElementById('big-thickness').addEventListener('click', () => {
    lineThickness = 15;
});

// Draw on canvas
canvas.addEventListener('mousedown', (e) => {
    if (currentUtility) {
        drawUtilityOnCanvas(e.offsetX, e.offsetY);
    }
});

// Function to draw the selected utility
function drawUtilityOnCanvas(x, y) {
    if (currentUtility) {
        currentUtility.x = x - currentUtility.width / 2;
        currentUtility.y = y - currentUtility.height / 2;

        // If it's a smoke, draw a radius
        if (currentUtility === utilities.smoke) {
            drawSmoke(x, y);
        } else if (currentUtility === utilities.molotov) {
            drawMolotov(x, y);
        } else {
            drawIcon(currentUtility.src, currentUtility.x, currentUtility.y, currentUtility.width, currentUtility.height);
        }
    }
}

// Function to draw the smoke effect (slightly yellow)
function drawSmoke(x, y) {
    const radius = currentUtility.radius;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 0, 0.3)'; // Slightly yellow smoke
    ctx.fill();
}

// Function to draw the Molotov effect (slightly orange)
function drawMolotov(x, y) {
    const radius = 50;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 140, 0, 0.4)'; // Slightly orange for Molotov
    ctx.fill();
}

// Function to draw the utility icon (frag, flash)
function drawIcon(src, x, y, width, height) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        ctx.drawImage(img, x, y, width, height);
    };
}

// Handle clear button
document.getElementById('clear-btn').addEventListener('click', () => {
    loadMap(currentMap); // Reload map to clear everything except map
});

// Initial map load
loadMap(currentMap);

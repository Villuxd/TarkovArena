const bombSites = {
    bowl: [{ x: 100, y: 200 }, { x: 300, y: 400 }],
    bay5: [{ x: 120, y: 250 }, { x: 350, y: 350 }],
    fort: [{ x: 150, y: 220 }, { x: 350, y: 450 }],
    skybridge: [{ x: 200, y: 250 }, { x: 400, y: 400 }]
};

let currentMap = '';
let draggedItem = null;

function loadMap(mapName) {
    currentMap = mapName;
    const mapCanvas = document.getElementById('mapCanvas');
    mapCanvas.innerHTML = ''; 

    const img = new Image();
    img.src = `images/${mapName}.jpg`;
    img.onload = function () {
        mapCanvas.appendChild(img);

        bombSites[mapName].forEach(site => {
            const bombSite = document.createElement('div');
            bombSite.classList.add('bomb-site');
            bombSite.style.left = `${site.x}px`;
            bombSite.style.top = `${site.y}px`;
            mapCanvas.appendChild(bombSite);
        });
    };
}

function drag(ev) {
    draggedItem = ev.target;
    ev.dataTransfer.setData("text", ev.target.id);
}

document.getElementById('mapCanvas').ondragover = function(ev) {
    ev.preventDefault();
};

document.getElementById('mapCanvas').ondrop = function(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);

    const rect = ev.target.getBoundingClientRect();
    const xPos = ev.clientX - rect.left - draggedElement.clientWidth / 2;
    const yPos = ev.clientY - rect.top - draggedElement.clientHeight / 2;

    draggedElement.style.position = "absolute";
    draggedElement.style.left = `${xPos}px`;
    draggedElement.style.top = `${yPos}px`;
    document.getElementById('mapCanvas').appendChild(draggedElement);
};


document.getElementById('mapCanvas').ondrop = function(ev) {
    ev.preventDefault();

    // Get the dragged element (could be smoke, grenade, etc.)
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);

    // Get the mouse drop position
    const rect = ev.target.getBoundingClientRect();
    const xPos = ev.clientX - rect.left - draggedElement.clientWidth / 2;
    const yPos = ev.clientY - rect.top - draggedElement.clientHeight / 2;

    // Set the dragged item's position
    draggedElement.style.position = "absolute";
    draggedElement.style.left = `${xPos}px`;
    draggedElement.style.top = `${yPos}px`;

    // Append the item to the map
    document.getElementById('mapCanvas').appendChild(draggedElement);

    // Check if the item is a smoke grenade
    if (draggedElement.id === "smoke") {
        createSmokeEffect(xPos, yPos);
    }
};

// Function to create smoke effect when smoke grenade is dropped
function createSmokeEffect(x, y) {
    // Create smoke cloud
    const smokeCloud = document.createElement('div');
    smokeCloud.classList.add('smoke-cloud');
    smokeCloud.style.left = `${x - 75}px`; // Center the cloud
    smokeCloud.style.top = `${y - 75}px`; // Center the cloud
    smokeCloud.style.width = `150px`;  // Adjust size of the smoke
    smokeCloud.style.height = `150px`; // Adjust size of the smoke

    // Create smoke radius
    const smokeRadius = document.createElement('div');
    smokeRadius.classList.add('smoke-radius');
    smokeRadius.style.left = `${x - 75}px`; // Center the radius
    smokeRadius.style.top = `${y - 75}px`; // Center the radius
    smokeRadius.style.width = `150px`; // Same radius as smoke cloud
    smokeRadius.style.height = `150px`; // Same radius as smoke cloud

    // Append smoke effect and radius to map canvas
    document.getElementById('mapCanvas').appendChild(smokeCloud);
    document.getElementById('mapCanvas').appendChild(smokeRadius);

    // Remove smoke effect after animation ends
    setTimeout(() => {
        smokeCloud.remove();
        smokeRadius.remove();
    }, 4000); // Duration matches animation time
}

// Load map image when a button is clicked
function loadMap(mapName) {
    const mapCanvas = document.getElementById('mapCanvas');
    mapCanvas.style.backgroundImage = `url('images/${mapName}.jpg')`; // Load map image from 'images' folder
    mapCanvas.innerHTML = ''; // Clear the map canvas
}

// Handle dragging functionality
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

// Handle the drop event on the map
document.getElementById('mapCanvas').ondrop = function(ev) {
    ev.preventDefault();

    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);

    // Get drop position
    const rect = ev.target.getBoundingClientRect();
    const xPos = ev.clientX - rect.left - draggedElement.clientWidth / 2;
    const yPos = ev.clientY - rect.top - draggedElement.clientHeight / 2;

    draggedElement.style.position = "absolute";
    draggedElement.style.left = `${xPos}px`;
    draggedElement.style.top = `${yPos}px`;

    document.getElementById('mapCanvas').appendChild(draggedElement);

    // If the dropped item is a smoke grenade, create the smoke effect
    if (draggedElement.id === "smoke") {
        createSmokeEffect(xPos, yPos);
    }
};

// Create smoke effect on drop (Persistent)
function createSmokeEffect(x, y) {
    // Create smoke cloud
    const smokeCloud = document.createElement('div');
    smokeCloud.classList.add('smoke-cloud');
    smokeCloud.style.left = `${x - 75}px`;
    smokeCloud.style.top = `${y - 75}px`;
    smokeCloud.style.width = `150px`;
    smokeCloud.style.height = `150px`;

    // Create smoke radius
    const smokeRadius = document.createElement('div');
    smokeRadius.classList.add('smoke-radius');
    smokeRadius.style.left = `${x - 75}px`;
    smokeRadius.style.top = `${y - 75}px`;
    smokeRadius.style.width = `150px`;
    smokeRadius.style.height = `150px`;

    // Append smoke effect and radius to map canvas
    document.getElementById('mapCanvas').appendChild(smokeCloud);
    document.getElementById('mapCanvas').appendChild(smokeRadius);

    // The smoke cloud and radius will stay visible indefinitely
}

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
    img.src = `${mapName}.jpg`; 
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

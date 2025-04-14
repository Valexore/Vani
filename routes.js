// centre manila
const map1 = L.map('map1').setView([14.5995, 120.9842], 10); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map1);

const terminals1 = [
  { name: "Manila Terminal", coords: [14.602251104020425, 120.99784405714034] },
  { name: "Sta. Teresita", coords: [14.60128470311564, 120.99791328610357] },
  { name: "Legarda", coords: [14.600878809564579, 120.9951455358591] },
  { name: "San Juan", coords: [14.6019, 121.0358] },
  { name: "Quezon City", coords: [14.676, 121.0437] },
  { name: "Marikina", coords: [14.65, 121.1] },
  { name: "Masinag", coords: [14.6181, 121.1189] },
  { name: "Antipolo", coords: [14.5842, 121.1764] },
  { name: "Teresa", coords: [14.5586, 121.2086] },
  { name: "Morong", coords: [14.5119, 121.2397] },
  { name: "Baras", coords: [14.5214, 121.2658] },
  { name: "Tanay", coords: [14.4964, 121.2864] },
  { name: "Pililla", coords: [14.444607821683023, 121.34220707331515] },
  { name: "Mabitac", coords: [14.433157754603998, 121.41244274456479] },
  { name: "Famy", coords: [14.472310574438941, 121.48297008748946] },
  { name: "Real", coords: [14.615303355399515, 121.59666223610522] },
  { name: "Infanta", coords: [14.74565752572017, 121.64995623922678] }
];

const markers1 = terminals1.map(terminal => {
  return L.marker(terminal.coords)
    .addTo(map1)
    .bindPopup(`<b>${terminal.name}</b><br>Coordinates: ${terminal.coords}`);
});

const routeCoordinates1 = terminals1.map(terminal => terminal.coords);

const routeCards1 = document.querySelectorAll('.map1-cards .route-card');
routeCards1.forEach((card, index) => {
  card.addEventListener('click', () => {
    const coords = card.getAttribute('data-coords').split(',').map(Number);

    map1.setView(coords, 15);

    markers1[index].openPopup();
  });
});


// centre manila
const map2 = L.map('map2').setView([14.7453, 121.6499], 10); 


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map2);

// Define terminal locations for the second map (latitude, longitude)
const terminals2 = [
  { name: "Infanta", coords: [14.74565752572017, 121.64995623922678] },
  { name: "Real", coords: [14.6633, 121.6044] },
  { name: "Sta. Mana", coords: [14.6500, 121.5500] }, 
  { name: "Sampaloc Baras", coords: [14.5214, 121.2658] },
  { name: "Pinugay", coords: [14.5000, 121.2500] },
  { name: "Boso boso", coords: [14.5500, 121.2000] }, 
  { name: "Padilla", coords: [14.5600, 121.1800] }, 
  { name: "Cogeo", coords: [14.6181, 121.1189] },
  { name: "Antipolo", coords: [14.5842, 121.1764] },
  { name: "Marikina", coords: [14.6500, 121.1000] },
  { name: "Rizal", coords: [14.6760, 121.0437] },
  { name: "Quezon City", coords: [14.6760, 121.0437] },
  { name: "San Juan", coords: [14.6019, 121.0358] },
  { name: "Sta. Mesa", coords: [14.6036, 121.0036] },
  { name: "Sta. Teresita", coords: [14.6036, 120.9936] },
  { name: "Infanta Terminal", coords: [14.7453, 121.6499] }   
];

const markers2 = terminals2.map(terminal => {
  return L.marker(terminal.coords)
    .addTo(map2)
    .bindPopup(`<b>${terminal.name}</b><br>Coordinates: ${terminal.coords}`);
});

const routeCoordinates2 = terminals2.map(terminal => terminal.coords);

const routeCards2 = document.querySelectorAll('.map2-cards .route-card');
routeCards2.forEach((card, index) => {
  card.addEventListener('click', () => {
    const coords = card.getAttribute('data-coords').split(',').map(Number);

    map2.setView(coords, 15);
    markers2[index].openPopup();
  });
});




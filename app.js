const map = L.map('map').setView([10.05, -84.05], 10);

const baseOSM = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }
).addTo(map);

const limitesLayer = L.geoJSON(null, {
  style: {
    weight: 2,
    fillOpacity: 0.08
  },
  onEachFeature: (feature, layer) => {
    layer.bindPopup(
      `<b>${feature.properties.nombre}</b><br>` +
      `Código: ${feature.properties.codigo}`
    );
  }
});

const parcelasLayer = L.geoJSON(null, {
  style: {
    weight: 2,
    fillOpacity: 0.45
  },
  onEachFeature: (feature, layer) => {
    const p = feature.properties;
    layer.bindPopup(
      `<b>Parcela ${p.id}</b><br>` +
      `Cultivo: ${p.cultivo}<br>` +
      `Área: ${p.area_ha} ha<br>` +
      `Productor: ${p.productor}`
    );
  }
});

Promise.all([
  fetch('data/limites_cr_demo.geojson').then(r => r.json()),
  fetch('data/parcelas_demo.geojson').then(r => r.json())
]).then(([limites, parcelas]) => {
  limitesLayer.addData(limites).addTo(map);
  parcelasLayer.addData(parcelas).addTo(map);

  const grupo = L.featureGroup([limitesLayer, parcelasLayer]);
  map.fitBounds(grupo.getBounds(), { padding: [20, 20] });
});

L.control.layers(
  { 'OpenStreetMap': baseOSM },
  {
    'Límites administrativos': limitesLayer,
    'Parcelas': parcelasLayer
  },
  { collapsed: false }
).addTo(map);

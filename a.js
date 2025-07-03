// Cesium Ion Access Token
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYjZjNGNiMC04ZmM0LTRlN2EtOTlmNS1iZjFjN2FkOGFkMDciLCJpZCI6MzQ1NzMsImlhdCI6MTczNzgzMzIwM30.__BEehDoPcj29xIuE6lLziCbAjgZi9ZWcq8qPugY_a4";

// Viewer oluştur (terrain kullanmadan)
const viewer = new Cesium.Viewer('cesiumContainer', {
  animation: false,
  timeline: false,
  baseLayerPicker: true,
  terrainProvider: undefined
});

// GeoJSON asset id (örnek bina veri asset id)
const assetId = 3512636;

async function loadAndExtrudeBuildings() {
  try {
    const resource = await Cesium.IonResource.fromAssetId(assetId);
    const dataSource = await Cesium.GeoJsonDataSource.load(resource, {
      clampToGround: false,
    });
    await viewer.dataSources.add(dataSource);
    await viewer.zoomTo(dataSource);

    const entities = dataSource.entities.values;
    for(let i=0; i < entities.length; i++) {
      const entity = entities[i];
      if(entity.polygon) {
        // Eğer GeoJSON'da height var ise onu kullan, yoksa 30 metre sabit yükseklik ver
        const height = entity.properties.height
          ? entity.properties.height.getValue()
          : 30;

        entity.polygon.extrudedHeight = height;
        entity.polygon.height = 0;
        entity.polygon.material = Cesium.Color.LIGHTGRAY.withAlpha(0.7);
        entity.polygon.outline = true;
        entity.polygon.outlineColor = Cesium.Color.BLACK;
      }
    }
  } catch (error) {
    console.error('Bina yüklenirken hata:', error);
  }
}

loadAndExtrudeBuildings();

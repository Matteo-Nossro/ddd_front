<template>
  <!-- Conteneur pour le canvas de deck.gl -->
  <div ref="deckContainer" style="width: 100vw; height: 100vh;"></div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
// Objets essentiels de deck.gl
import {Deck} from '@deck.gl/core'
import {_GlobeView as GlobeView} from '@deck.gl/core';
import { GeoJsonLayer } from '@deck.gl/layers'
import {PolygonLayer} from '@deck.gl/layers'

const deckContainer = ref(null)

onMounted(() => {
  const deck = new Deck({
    parent: deckContainer.value,
    views: [new GlobeView()],
    initialViewState: {
      latitude: 0,
      longitude: 0,
      zoom: 0,
      bearing: 0,
      pitch: 0
    },
    controller: true,
    layers: [
      new GeoJsonLayer({
        id: 'countries-layer',
        data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson',
        pickable: true,
        filled: true,
        stroked: true,
        getFillColor: [200, 0, 80, 180],
        getLineColor: [255, 255, 255],
        onClick: info => {
          if (info.object) {
            const country = info.object.properties?.name || info.object.properties?.ADMIN
            alert(`Pays cliqué : ${country}`)
          }
        }
      })
    ]
  })
})
</script>

<style scoped>
/* Ajustez si nécessaire */
</style>

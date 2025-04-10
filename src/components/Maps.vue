<template>
  <!-- Conteneur pour le canvas de deck.gl -->
  <div ref="deckContainer" style="width: 100vw; height: 100vh;"></div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
// Objets essentiels de deck.gl
import { Deck } from '@deck.gl/core'
import { _GlobeView as GlobeView } from '@deck.gl/core';

import { PolygonLayer } from '@deck.gl/layers'

// Référence au div dans lequel deck.gl dessinera
const deckContainer = ref(null)

onMounted(() => {
  // Création d'une instance Deck
  const deck = new Deck({
    // DOM element où on va rendre la scène
    parent: deckContainer.value,

    // Utilisation de la vue "GlobeView" pour un rendu type globe 3D
    views: [new GlobeView({id: 'globe-view'})],

    // État initial de la caméra
    initialViewState: {
      latitude: 0,   // Centre de la Terre
      longitude: 0,
      zoom: 0,       // Zoom plus ou moins distant
      bearing: 0,    // Orientation nord
      pitch: 0       // Inclinaison
    },

    // Activation du contrôle de rotation/zoom de la souris
    controller: {inertia: true},

    // Définition des couches, ici un PolygonLayer minimal
    layers: [
      new PolygonLayer({
        id: 'polygon-layer',
        // Vous pouvez passer un GeoJSON ou un tableau d'objets
        // Exemple minimal: un fichier GeoJSON en remote ou local
        data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson',

        // Activer le "picking" pour gérer clics & survols
        pickable: true,

        // Rendu
        filled: true,
        wireframe: false,

        // Comment deck.gl récupère la géométrie
        // Si `data` est un GeoJSON, préférez le `GeoJsonLayer`
        // qui gère nativement geometry/feature. Sinon, vous pouvez
        // extraire vous-même le tableau de coordonnées:
        getPolygon: f => f.geometry.coordinates,

        // Couleur de remplissage [r, g, b, alpha]
        getFillColor: [200, 0, 80, 180],

        // Callback lorsqu'on clique
        onClick: info => {
          if (info.object) {
            // Par ex. si on a un GeoJSON Feature, on peut accéder à:
            const countryName = info.object.properties?.name || info.object.properties?.ADMIN
            alert(`Vous avez cliqué sur : ${countryName}`)
            console.log('Pays cliqué :', countryName)
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

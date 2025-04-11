<template>
	<div class="mainLayout">
		<top-bar/>
		<MainMenu/>
		<section class="page-container">
			<router-view/>
		</section>
	</div>
</template>

<script setup lang="ts">

import TopBar from "../components/TopBar.vue";
import MainMenu from "../components/MainMenu.vue"

import {computed} from "vue";
// import {keycloak} from "../utils/keycloak.ts";

// const mainStore = useMainStore();

// const isMenuOpen = computed(()=> mainStore.isMenuOpen)


// console.log('Main layout keycloak.token',keycloak.token)

</script>

<style scoped lang="scss">
.mainLayout {
	margin: 0 auto;
	width: 100%;
	background-color: #F8FAFC;
	overflow-y : auto;
	height: 100%;
	.page-container {
		height: 100%;
		margin-left: 280px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 7rem 2rem 2rem 4rem;
		min-height: calc(100vh - 9rem);
		transition: margin 0.5s ease-out;

	}

}
.close-menu{
	margin-left: 0 !important;
	padding: 7rem 2rem 2rem 2rem !important;
	transition: margin 0.5s ease-out;

}


</style>
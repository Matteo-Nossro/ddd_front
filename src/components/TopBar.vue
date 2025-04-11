<template>
	<div class="topbar">
		<div class="menu_icon">
<!--			<img src="../assets/Lmh.svg" class="lmh-icon" />-->
		</div>
<!--		<div class="logo" @click="toggleMenu">-->
<!--			<i class="pi pi-bars" style="font-size: 2rem"></i>-->
<!--		</div>-->
	</div>
</template>

<script setup lang="ts">




// const toggleMenu =  ()=>{
// 	mainStore.toogleMenu()
// }

</script>

<style scoped lang="scss">
.topbar{
	height: 80px;
	width: 100%;
	position: fixed;
	top :0;
	left: 0;
	box-shadow : 0 3px 5px #00000005,0 0 2px #0000000d,0 1px 4px #00000014;
	//background-color: #D81E05;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	z-index: 900;

	.menu_icon{
		height: 46px;
		.lmh-icon {
			margin-left :2rem;
			height: 100%;
			overflow: visible;
			overflow-clip-margin: unset;
		}
	}

	.logo{
		margin-left : 5rem;
		color:white;
		cursor : pointer;
	}
}
</style>
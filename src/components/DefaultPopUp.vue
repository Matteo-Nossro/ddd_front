<template>
	<Dialog
			v-model:visible="visible"
			modal
			:style="globalStyle"
			:closable="false"
			:dismissableMask="true"
			@hide="emit('close')"
	>
		<div class="dialog-content">
			<slot name="content" />
		</div>
		<template #footer>
			<slot name="buttons">
				<DefaultButton @click="emit('close')">
					Fermer
				</DefaultButton>
			</slot>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import Dialog from 'primevue/dialog'
import DefaultButton from "./DefaultButton.vue";

const props = defineProps<{
	globalStyle?: any;
}>()

const emit = defineEmits<{
	(e: 'close'): void;
}>()

const visible = ref(true)
</script>

<style scoped>
.dialog-content {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: 1rem 0;
}

:deep(.p-dialog) {
	width: 50vw;
	max-width: 500px;
}

:deep(.p-dialog-content) {
	padding: 0 1.5rem;
}

:deep(.p-dialog-footer) {
	display: flex;
	justify-content: flex-end;
	gap: 0.75rem;
	padding: 1rem 1.5rem;
}
</style>

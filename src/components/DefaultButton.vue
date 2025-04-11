<template>
	<button
			:class="['reusable-button', variant]"
			:disabled="disabled"
			@click="handleClick"
	>
		<slot />
	</button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
	variant: {
		type: String,
		default: 'primary', // 'primary', 'secondary'
	},
	disabled: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(['click'])

function handleClick(event) {
	if (!props.disabled) emit('click', event)
}
</script>

<style scoped>
.reusable-button {
	padding: 0.6em 1.2em;
	font-size: 1rem;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	transition: background-color 0.2s ease, transform 0.1s ease;
	font-weight: 500;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.reusable-button:active {
	transform: scale(0.97);
}

.reusable-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.reusable-button.primary {
	background-color: #3b82f6;
	color: white;
}

.reusable-button.primary:hover:not(:disabled) {
	background-color: #2563eb;
}

.reusable-button.secondary {
	background-color: #f3f4f6;
	color: #111827;
}

.reusable-button.secondary:hover:not(:disabled) {
	background-color: #e5e7eb;
}
</style>

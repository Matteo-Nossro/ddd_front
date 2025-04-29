<template>
  <div class="container" :style="props.styles">
    <span v-if="props.title !== undefined" class="title">{{ props.title }}</span>
    <slot class="content"></slot>
  </div>
</template>
<script setup lang="ts">


const props = defineProps<{
  title?: string
  styles?:string
}>()

</script>
<style scoped lang="scss">
.container{
  height:auto;
  background-color: white;
  padding: 1.5rem;
  border-radius: 21px;
  width:100%;
  box-shadow : 0 3px 5px rgba(0, 0, 0, 0.02), 0 0 2px rgba(0, 0, 0, 0.05), 0 1px 4px rgba(0, 0, 0, 0.08);
  display:flex;
  flex-direction: column;
  align-items: flex-start;


  .title{
    color: #495057;
    font-size: 21px;
    font-weight : 600;
    margin-bottom: 1rem;
  }
}
</style>
<script setup>
// 行内引用：数据旁边的小角标，点击直接打开原始来源，不用滚到页底再找链接。
defineProps({
  href: { type: String, required: true },
  label: { type: String, required: true },
});
</script>

<template>
  <sup class="cite"><a :href="href" target="_blank" rel="noopener noreferrer" :title="`来源：${label}（新窗口打开）`">{{ label }}</a></sup>
</template>

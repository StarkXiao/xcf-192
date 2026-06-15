import fs from 'fs';

// 读取原始文件
const originalContent = fs.readFileSync('src/components/JournalEditor.vue', 'utf8');
console.log('原始文件长度:', originalContent.length);

// 分离三个部分
const templateMatch = originalContent.match(/<template>([\s\S]*?)<\/template>/);
const scriptMatch = originalContent.match(/<script setup>([\s\S]*?)<\/script>/);
const styleMatch = originalContent.match(/<style scoped>([\s\S]*?)<\/style>/);

if (!templateMatch || !scriptMatch || !styleMatch) {
  console.log('❌ 无法找到所有部分');
  console.log('模板:', !!templateMatch);
  console.log('脚本:', !!scriptMatch);
  console.log('样式:', !!styleMatch);
  process.exit(1);
}

console.log('✅ 找到所有部分');
console.log('模板内容长度:', templateMatch[1].length);
console.log('脚本内容长度:', scriptMatch[1].length);
console.log('样式内容长度:', styleMatch[1].length);

// 重新组合内容，确保格式正确
const newContent = `<template>${templateMatch[1]}</template>

<script setup>${scriptMatch[1]}</script>

<style scoped>${styleMatch[1]}</style>
`;

console.log('新文件长度:', newContent.length);

// 备份原始文件
fs.copyFileSync('src/components/JournalEditor.vue', 'src/components/JournalEditor.vue.bak');
console.log('✅ 已备份原始文件到 JournalEditor.vue.bak');

// 写入新文件
fs.writeFileSync('src/components/JournalEditor.vue', newContent, 'utf8');
console.log('✅ 已重新写入文件');

// 验证新文件
const verifyContent = fs.readFileSync('src/components/JournalEditor.vue', 'utf8');
console.log('验证文件长度:', verifyContent.length);
console.log('内容匹配:', verifyContent === newContent);

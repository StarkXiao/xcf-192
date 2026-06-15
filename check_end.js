import fs from 'fs';

const content = fs.readFileSync('src/components/JournalEditor.vue', 'utf8');

console.log('文件总长度:', content.length);

// 查找 </style> 标签
const styleEnd = content.lastIndexOf('</style>');
console.log('</style> 位置:', styleEnd);

if (styleEnd === -1) {
  console.log('❌ 没有找到 </style> 标签！');
  
  // 检查文件的最后 100 个字符
  console.log('\n文件最后 100 个字符:');
  const last100 = content.slice(-100);
  console.log(last100);
  
  console.log('\n最后 100 个字符的编码:');
  for (let i = last100.length - 20; i < last100.length; i++) {
    const char = last100[i];
    const code = char.charCodeAt(0);
    const display = code < 32 || code > 126 ? `U+${code.toString(16).padStart(4, '0')}` : `"${char}"`;
    console.log(`  [${i - last100.length}]: ${display}`);
  }
} else {
  console.log('✅ 找到 </style> 标签');
  console.log('标签内容:', content.substring(styleEnd, styleEnd + 20));
  
  // 检查 <style scoped> 标签
  const styleStart = content.indexOf('<style scoped>');
  console.log('<style scoped> 位置:', styleStart);
  
  // 检查样式内容长度
  const styleContent = content.substring(styleStart, styleEnd + 8);
  console.log('样式内容长度:', styleContent.length);
  
  // 检查样式部分的行数
  const styleLines = styleContent.split('\n').length;
  console.log('样式部分行数:', styleLines);
}

// 检查所有的标签
console.log('\n=== 检查所有顶级标签 ===');
const tags = ['<template>', '</template>', '<script setup>', '</script>', '<style scoped>', '</style>'];
tags.forEach(tag => {
  const pos = content.indexOf(tag);
  const lastPos = content.lastIndexOf(tag);
  console.log(`${tag}: 首次出现=${pos}, 最后出现=${lastPos}`);
});

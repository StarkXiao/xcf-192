import fs from 'fs';

const content = fs.readFileSync('src/components/JournalEditor.vue', 'utf8');
const lines = content.split('\n');

console.log('文件总行数:', lines.length);

// 显示最后 30 行
console.log('\n=== 最后 30 行 ===');
lines.slice(-30).forEach((line, idx) => {
  const lineNum = lines.length - 30 + idx + 1;
  console.log(`${lineNum.toString().padStart(4)}: ${line}`);
});

// 查找所有的 .fade- 类，因为我们在最后看到了它们
console.log('\n=== 查找 .fade- 类 ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('.fade-')) {
    console.log(`行 ${i+1}: ${lines[i]}`);
  }
}

// 检查是否有动画相关的 CSS
console.log('\n=== 动画相关 CSS ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('@keyframes') || lines[i].includes('animation') || lines[i].includes('transition')) {
    if (i > lines.length - 50) {
      console.log(`行 ${i+1}: ${lines[i].substring(0, 80)}`);
    }
  }
}

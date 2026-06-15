import { parse } from '@vue/compiler-sfc';
import fs from 'fs';

const content = fs.readFileSync('src/components/JournalEditor.vue', 'utf8');

// 先测试完整文件
console.log('=== 测试完整文件 ===');
try {
  const { errors } = parse(content, { filename: 'JournalEditor.vue' });
  console.log('完整文件错误数:', errors.length);
  errors.forEach(err => console.log('  ', err.message, 'at line', err.loc?.start?.line));
} catch (e) {
  console.log('异常:', e.message);
}

// 现在，让我们尝试修改脚本部分的最后
console.log('\n=== 尝试修改脚本部分的最后 ===');

// 获取模板和脚本部分
const scriptEnd = content.indexOf('</script>');
const beforeScript = content.substring(0, scriptEnd);

// 尝试1: 在 watch 函数后添加分号
console.log('\n尝试1: 在 watch 函数后添加分号');
const modified1 = beforeScript + ';\n</script>\n\n<style scoped>\n.test { color: red; }\n</style>\n';
try {
  const { errors } = parse(modified1, { filename: 'test.vue' });
  console.log('  错误数:', errors.length);
  errors.forEach(err => console.log('  ', err.message));
} catch (e) {
  console.log('  异常:', e.message);
}

// 尝试2: 替换整个 watch 函数
console.log('\n尝试2: 替换整个 watch 函数');
const watchStart = content.lastIndexOf('watch(showModal');
const beforeWatch = content.substring(0, watchStart);
const newWatch = `watch(showModal, (val) => {
  if (val) {
    activeTab.value = 'items';
  }
});
`;
const modified2 = beforeWatch + newWatch + '</script>\n\n<style scoped>\n.test { color: red; }\n</style>\n';
try {
  const { errors } = parse(modified2, { filename: 'test.vue' });
  console.log('  错误数:', errors.length);
  errors.forEach(err => console.log('  ', err.message));
} catch (e) {
  console.log('  异常:', e.message);
}

// 尝试3: 检查脚本部分是否有未闭合的字符串
console.log('\n=== 检查脚本部分的字符串 ===');
const scriptContent = content.substring(content.indexOf('<script setup>'), scriptEnd + 9);
let inString = false;
let stringChar = '';
let stringStartLine = 0;
const scriptLines = scriptContent.split('\n');

for (let i = 0; i < scriptLines.length; i++) {
  const line = scriptLines[i];
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if ((char === '"' || char === "'" || char === '`') && line[j-1] !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
        stringStartLine = i + 1;
      } else if (char === stringChar) {
        inString = false;
      }
    }
  }
}

if (inString) {
  console.log(`⚠️  发现未闭合的字符串，从第 ${stringStartLine} 行开始`);
} else {
  console.log('✅ 所有字符串都已闭合');
}

// 尝试4: 检查是否有未闭合的模板字符串
console.log('\n=== 检查模板字符串 ===');
const templateLiteralRegex = /`[^`]*$/g;
const matches = scriptContent.match(templateLiteralRegex);
if (matches) {
  console.log('⚠️  发现可能未闭合的模板字符串:');
  matches.forEach((m, i) => {
    console.log(`  ${i+1}: ${m.substring(0, 50)}...`);
  });
} else {
  console.log('✅ 没有发现未闭合的模板字符串');
}

// 尝试5: 检查完整的 watch 函数
console.log('\n=== 检查完整的 watch 函数 ===');
const watchFull = content.substring(content.lastIndexOf('watch(showModal'), content.indexOf('</script>'));
console.log('watch 函数完整内容:');
console.log(watchFull);
console.log('字符数:', watchFull.length);

// 检查括号匹配
let parenCount = 0;
let braceCount = 0;
for (let i = 0; i < watchFull.length; i++) {
  const char = watchFull[i];
  if (char === '(') parenCount++;
  if (char === ')') parenCount--;
  if (char === '{') braceCount++;
  if (char === '}') braceCount--;
}
console.log('括号数:', parenCount, '大括号数:', braceCount);

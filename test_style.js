import { parse } from '@vue/compiler-sfc';
import fs from 'fs';

const content = fs.readFileSync('src/components/JournalEditor.vue', 'utf8');

// 先获取模板+脚本部分
const scriptEnd = content.indexOf('</script>') + 9;
const templateAndScript = content.substring(0, scriptEnd);

console.log('=== 测试逐步添加样式 ===');

// 测试1: 只加 <style scoped></style>
console.log('\n测试1: 只加空的 style 标签');
const test1 = templateAndScript + '\n\n<style scoped>\n</style>\n';
try {
  const { errors } = parse(test1, { filename: 'test.vue' });
  console.log('  错误数:', errors.length);
  errors.forEach(err => console.log('  ', err.message));
} catch (e) {
  console.log('  异常:', e.message);
}

// 测试2: 加简单的样式
console.log('\n测试2: 加简单的样式');
const test2 = templateAndScript + '\n\n<style scoped>\n.test { color: red; }\n</style>\n';
try {
  const { errors } = parse(test2, { filename: 'test.vue' });
  console.log('  错误数:', errors.length);
  errors.forEach(err => console.log('  ', err.message));
} catch (e) {
  console.log('  异常:', e.message);
}

// 测试3: 加真实样式的前10行
console.log('\n测试3: 加真实样式的前10行');
const styleStart = content.indexOf('<style');
const styleContent = content.substring(styleStart);
const styleLines = styleContent.split('\n');
const first10Lines = styleLines.slice(0, 11).join('\n');
const test3 = templateAndScript + '\n' + first10Lines;
try {
  const { errors } = parse(test3, { filename: 'test.vue' });
  console.log('  错误数:', errors.length);
  errors.forEach(err => console.log('  ', err.message));
} catch (e) {
  console.log('  异常:', e.message);
}

// 测试4: 检查原始样式部分的字符编码
console.log('\n=== 检查样式部分的字符编码 ===');
const fullStyle = content.substring(styleStart);
console.log('样式部分长度:', fullStyle.length);

// 检查样式部分的前100个字符
console.log('样式部分前100个字符:');
for (let i = 0; i < Math.min(100, fullStyle.length); i++) {
  const char = fullStyle[i];
  const code = char.charCodeAt(0);
  if (code < 32 || code > 126) {
    console.log(`  [${i}]: U+${code.toString(16).padStart(4, '0')}`);
  }
}

// 检查 <style 标签前后的字符
console.log('\n=== 检查 <style 标签前后 ===');
const styleTagPos = content.indexOf('<style');
for (let i = styleTagPos - 10; i < styleTagPos + 20; i++) {
  if (i >= 0 && i < content.length) {
    const char = content[i];
    const code = char.charCodeAt(0);
    const display = code < 32 || code > 126 ? `U+${code.toString(16).padStart(4, '0')}` : `"${char}"`;
    const marker = i === styleTagPos ? ' <<< <style start' : '';
    console.log(`  ${i}: ${display}${marker}`);
  }
}

// 测试5: 检查是否是脚本部分的最后有问题
console.log('\n=== 检查脚本部分的最后 ===');
const watchEnd = content.indexOf('watch(showModal');
console.log('watch 函数位置:', watchEnd);
const watchCode = content.substring(watchEnd, watchEnd + 200);
console.log('watch 代码:', watchCode);

// 检查 watch 函数是否正确关闭
let braceCount = 0;
let inFunction = false;
for (let i = 0; i < watchCode.length; i++) {
  const char = watchCode[i];
  if (char === '{') {
    braceCount++;
    inFunction = true;
  } else if (char === '}') {
    braceCount--;
  }
  if (inFunction && braceCount === 0) {
    console.log(`watch 函数在第 ${i} 个字符处关闭`);
    console.log('关闭后的内容:', watchCode.substring(i, i + 20));
    break;
  }
}
console.log('最终括号数:', braceCount);

import { parse } from '@vue/compiler-sfc';
import fs from 'fs';

// 测试简单文件
console.log('=== 测试简单文件 ===');
const simpleContent = fs.readFileSync('src/components/TestSimple.vue', 'utf8');
try {
  const { descriptor, errors } = parse(simpleContent, {
    filename: 'TestSimple.vue'
  });
  console.log('简单文件解析错误:', errors.length);
  errors.forEach(err => console.log('  ', err.message));
  console.log('简单文件解析成功！');
} catch (e) {
  console.log('简单文件解析异常:', e.message);
}

// 现在测试 JournalEditor.vue
console.log('\n=== 测试 JournalEditor.vue ===');
const content = fs.readFileSync('src/components/JournalEditor.vue', 'utf8');

// 尝试只保留模板部分
console.log('\n=== 只保留模板部分 ===');
const templateOnly = content.substring(0, content.indexOf('</template>') + 11) + '\n';
try {
  const { descriptor, errors } = parse(templateOnly, {
    filename: 'JournalEditor.vue'
  });
  console.log('只保留模板部分解析错误:', errors.length);
  errors.forEach(err => console.log('  ', err.message, err.loc));
} catch (e) {
  console.log('异常:', e.message);
}

// 尝试只保留模板和脚本部分
console.log('\n=== 保留模板和脚本部分 ===');
const templateAndScript = content.substring(0, content.indexOf('</script>') + 9) + '\n';
try {
  const { descriptor, errors } = parse(templateAndScript, {
    filename: 'JournalEditor.vue'
  });
  console.log('保留模板和脚本部分解析错误:', errors.length);
  errors.forEach(err => console.log('  ', err.message, err.loc));
} catch (e) {
  console.log('异常:', e.message);
}

// 尝试检查是否是缩进问题
console.log('\n=== 检查缩进 ===');
const lines = content.split('\n');
for (let i = 0; i < 10; i++) {
  const line = lines[i];
  let indent = 0;
  while (indent < line.length && line[indent] === ' ') indent++;
  console.log(`行 ${i+1}: 缩进=${indent} 内容=${line.substring(0, 50)}`);
}

// 检查脚本部分的最后几行
console.log('\n=== 脚本部分最后10行 ===');
const scriptEnd = content.indexOf('</script>');
const scriptStart = content.lastIndexOf('<script', scriptEnd);
const scriptContent = content.substring(scriptStart, scriptEnd + 9);
const scriptLines = scriptContent.split('\n');
scriptLines.slice(-10).forEach((line, idx) => {
  const lineNum = scriptLines.length - 10 + idx + 1;
  let indent = 0;
  while (indent < line.length && line[indent] === ' ') indent++;
  console.log(`行 ${lineNum}: 缩进=${indent} 内容=${line.substring(0, 60)}`);
});

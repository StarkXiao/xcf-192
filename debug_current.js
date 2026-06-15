import { parse } from '@vue/compiler-sfc';
import fs from 'fs';

const content = fs.readFileSync('src/components/JournalEditor.vue', 'utf8');

console.log('=== 当前文件状态 ===');
console.log('文件总长度:', content.length);

// 查找所有的反引号
console.log('\n=== 反引号位置 ===');
const backtickPositions = [];
for (let i = 0; i < content.length; i++) {
  if (content[i] === '`') {
    backtickPositions.push(i);
    const lineNum = content.substring(0, i).split('\n').length;
    console.log(`  位置 ${i} (行 ${lineNum}): ${content.substring(Math.max(0, i-20), i+20).replace(/\n/g, '\\n')}`);
  }
}
console.log('反引号总数:', backtickPositions.length);
if (backtickPositions.length % 2 !== 0) {
  console.log('⚠️  反引号数量是奇数，有未闭合的模板字符串！');
} else {
  console.log('✅ 反引号数量是偶数');
}

// 检查脚本部分
const scriptStart = content.indexOf('<script setup>');
const scriptEnd = content.indexOf('</script>');
console.log('\n=== 脚本部分 ===');
console.log('脚本开始:', scriptStart, '(行', content.substring(0, scriptStart).split('\n').length, ')');
console.log('脚本结束:', scriptEnd, '(行', content.substring(0, scriptEnd).split('\n').length, ')');

const scriptContent = content.substring(scriptStart, scriptEnd + 9);
console.log('脚本内容长度:', scriptContent.length);

// 检查脚本部分中的反引号
const scriptBackticks = [];
for (let i = 0; i < scriptContent.length; i++) {
  if (scriptContent[i] === '`') {
    scriptBackticks.push(i);
  }
}
console.log('脚本中的反引号数量:', scriptBackticks.length);

// 尝试解析
console.log('\n=== 尝试解析 ===');
try {
  const { descriptor, errors } = parse(content, {
    filename: 'JournalEditor.vue'
  });
  console.log('解析错误:', errors.length);
  errors.forEach((err, idx) => {
    console.log(`\n错误 ${idx + 1}:`);
    console.log('  消息:', err.message);
    console.log('  位置:', err.loc);
  });
  
  console.log('\n=== 文件结构 ===');
  console.log('模板:', descriptor.template ? '存在' : '不存在');
  console.log('脚本Setup:', descriptor.scriptSetup ? '存在' : '不存在');
  console.log('样式:', descriptor.styles.length, '个');
  
  if (descriptor.template) {
    console.log('模板内容长度:', descriptor.template.content.length);
    // 检查模板内容的最后几个字符
    const lastChars = descriptor.template.content.slice(-50);
    console.log('模板最后50个字符:', JSON.stringify(lastChars));
  }
} catch (e) {
  console.log('异常:', e.message);
  console.log(e.stack);
}

// 检查第 1115-1125 行
console.log('\n=== 第 1115-1125 行 ===');
const lines = content.split('\n');
for (let i = 1114; i < Math.min(1125, lines.length); i++) {
  const lineNum = i + 1;
  const prefix = lineNum === 1117 ? '>>> ' : '    ';
  console.log(`${prefix}${lineNum}: ${lines[i]}`);
}

import { parse } from '@vue/compiler-sfc';
import fs from 'fs';

const content = fs.readFileSync('src/components/JournalEditor.vue', 'utf8');

// 提取模板内容
const templateStart = content.indexOf('<template>') + 10;
const templateEnd = content.indexOf('</template>');
const templateContent = content.substring(templateStart, templateEnd);

console.log('模板内容长度:', templateContent.length);
console.log('模板行数:', templateContent.split('\n').length);

// 检查最后 200 个字符
console.log('\n=== 模板最后 200 个字符 ===');
const last200 = templateContent.slice(-200);
console.log(last200);

// 检查最后 200 个字符的编码
console.log('\n=== 最后 200 个字符的编码 ===');
for (let i = last200.length - 50; i < last200.length; i++) {
  const char = last200[i];
  const code = char.charCodeAt(0);
  const display = code < 32 || code > 126 ? `U+${code.toString(16).padStart(4, '0')}` : `"${char}"`;
  console.log(`  [${i - last200.length}]: ${display}`);
}

// 检查模板内容的最后几行
console.log('\n=== 模板最后 10 行 ===');
const lines = templateContent.split('\n');
lines.slice(-10).forEach((line, idx) => {
  const lineNum = lines.length - 10 + idx + 1;
  let indent = 0;
  while (indent < line.length && line[indent] === ' ') indent++;
  console.log(`${lineNum.toString().padStart(4)} (缩进=${indent}): ${line.substring(0, 60)}`);
});

// 查找最后几个标签
console.log('\n=== 查找最后几个标签 ===');
const tagRegex = /<\/?[a-zA-Z][a-zA-Z0-9-]*[^>]*>/g;
const matches = [];
let match;
while ((match = tagRegex.exec(templateContent)) !== null) {
  matches.push({
    tag: match[0],
    index: match.index
  });
}

console.log('总标签数:', matches.length);
console.log('最后 10 个标签:');
matches.slice(-10).forEach((m, idx) => {
  const lineNum = templateContent.substring(0, m.index).split('\n').length + 1;
  console.log(`  ${matches.length - 10 + idx + 1}. 行${lineNum}: ${m.tag.substring(0, 40)}`);
});

// 检查是否有未关闭的标签
console.log('\n=== 检查未关闭的标签 ===');
const stack = [];
matches.forEach((m, idx) => {
  const tag = m.tag;
  if (tag.startsWith('</')) {
    // 关闭标签
    const tagName = tag.substring(2, tag.length - 1).trim().split(' ')[0];
    // 查找匹配的开始标签
    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack[i].name === tagName && !stack[i].closed) {
        stack[i].closed = true;
        break;
      }
    }
  } else if (!tag.endsWith('/>')) {
    // 开始标签
    const tagName = tag.substring(1, tag.length - 1).trim().split(' ')[0];
    const lineNum = templateContent.substring(0, m.index).split('\n').length + 1;
    stack.push({
      name: tagName,
      line: lineNum,
      closed: false
    });
  }
});

const unclosed = stack.filter(s => !s.closed);
console.log('未关闭的标签数:', unclosed.length);
unclosed.forEach(s => {
  console.log(`  <${s.name}> at line ${s.line}`);
});

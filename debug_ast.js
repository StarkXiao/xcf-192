import { parse, transform, generate } from '@vue/compiler-dom';
import fs from 'fs';

const content = fs.readFileSync('src/components/JournalEditor.vue', 'utf8');

// 提取模板内容
const templateStart = content.indexOf('<template>') + 10;
const templateEnd = content.indexOf('</template>');
const templateContent = content.substring(templateStart, templateEnd);

console.log('模板内容长度:', templateContent.length);
console.log('模板行数:', templateContent.split('\n').length);

// 尝试使用 Vue 的编译器解析
try {
  const ast = parse(templateContent, {
    filename: 'JournalEditor.vue',
    onError: (err) => {
      console.log('\n=== 解析错误 ===');
      console.log('错误:', err.message);
      console.log('位置:', err.loc);
      if (err.loc) {
        const lines = templateContent.split('\n');
        const lineNum = err.loc.start.line - 1; // 0-based
        if (lineNum >= 0 && lineNum < lines.length) {
          console.log('\n错误附近的内容:');
          for (let i = Math.max(0, lineNum - 5); i < Math.min(lines.length, lineNum + 5); i++) {
            const prefix = i === lineNum ? '>>> ' : '    ';
            console.log(`${prefix}${i + 1}: ${lines[i]}`);
          }
        }
      }
    }
  });
  
  console.log('\n✅ 解析成功！');
  
  // 统计节点类型
  const nodeTypes = {};
  function countNodes(node) {
    if (node.type === 1) { // Element
      const tag = node.tag;
      nodeTypes[tag] = (nodeTypes[tag] || 0) + 1;
      if (node.children) {
        node.children.forEach(countNodes);
      }
    } else if (node.children) {
      node.children.forEach(countNodes);
    }
  }
  countNodes(ast);
  
  console.log('\n=== 节点统计 ===');
  Object.entries(nodeTypes).forEach(([tag, count]) => {
    console.log(`  ${tag}: ${count}`);
  });
  
} catch (e) {
  console.log('\n❌ 异常:', e.message);
  console.log(e.stack);
}

// 检查模板内容的特殊字符
console.log('\n=== 检查特殊字符 ===');
const specialChars = ['\u0000', '\u000b', '\u000c', '\u0085', '\u00a0', '\ufeff'];
specialChars.forEach(char => {
  if (templateContent.includes(char)) {
    const code = char.charCodeAt(0).toString(16);
    console.log(`⚠️  发现特殊字符 U+${code.padStart(4, '0')}，出现次数: ${(templateContent.match(new RegExp(char, 'g')) || []).length}`);
  }
});

// 检查是否有异常的换行符
const lines = templateContent.split('\n');
let hasWindowsLineEndings = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].endsWith('\r')) {
    hasWindowsLineEndings = true;
    break;
  }
}
if (hasWindowsLineEndings) {
  console.log('⚠️  发现 Windows 风格的换行符 (CRLF)');
} else {
  console.log('✅ 使用 Unix 风格的换行符 (LF)');
}

// 检查最后几个字符
console.log('\n=== 模板最后50个字符 ===');
const lastChars = templateContent.slice(-50);
console.log(`"${lastChars}"`);
console.log('字符编码:');
for (let i = lastChars.length - 10; i < lastChars.length; i++) {
  const char = lastChars[i];
  console.log(`  [${i - lastChars.length}]: "${char}" (U+${char.charCodeAt(0).toString(16).padStart(4, '0')})`);
}

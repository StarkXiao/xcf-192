import fs from 'fs';

const content = fs.readFileSync('src/components/JournalEditor.vue', 'utf8');

console.log('=== 检查文件结构 ===');
console.log('文件总长度:', content.length);

// 查找 <template> 标签
const templateStart = content.indexOf('<template>');
console.log('<template> 位置:', templateStart);

// 查找 </template> 标签
const templateEnd = content.indexOf('</template>');
console.log('</template> 位置:', templateEnd);

if (templateStart !== -1 && templateEnd !== -1) {
  console.log('模板内容长度:', templateEnd - templateStart);
  
  // 检查模板内容中是否还有其他 </template> 标签
  const templateContent = content.substring(templateStart, templateEnd + 11);
  const otherTemplateEnd = templateContent.indexOf('</template>', 10);
  if (otherTemplateEnd !== -1) {
    console.log('⚠️  模板内容中还有另一个 </template> 标签在位置:', otherTemplateEnd);
    console.log('附近内容:', templateContent.substring(otherTemplateEnd - 50, otherTemplateEnd + 50));
  } else {
    console.log('✅ 模板内容中没有其他 </template> 标签');
  }
  
  // 检查模板内容中是否有未转义的 > 字符可能导致解析问题
  console.log('\n=== 检查可能的解析问题 ===');
  
  // 查找所有的 > 字符，检查它们是否在标签内
  const lines = templateContent.split('\n');
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      // 检查字符串边界
      if ((char === '"' || char === "'") && line[j-1] !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
      }
      
      // 检查在字符串外的 > 字符，可能不是标签的一部分
      if (char === '>' && !inString) {
        // 检查前面是否有 < 字符
        const before = line.substring(0, j + 1);
        const lastOpenBracket = before.lastIndexOf('<');
        if (lastOpenBracket === -1 || before.substring(lastOpenBracket).indexOf(' ') === -1 && before.substring(lastOpenBracket).indexOf('/') === -1) {
          // 可能是一个问题
          if (i < 5 || i > lines.length - 5) { // 只显示开头和结尾的行
            console.log(`⚠️  第 ${i+1} 行第 ${j+1} 列可能有问题: ${line.substring(Math.max(0, j-20), j+20)}`);
          }
        }
      }
    }
  }
  
  // 检查最后几行
  console.log('\n=== 模板最后10行 ===');
  lines.slice(-10).forEach((line, idx) => {
    const lineNum = lines.length - 10 + idx + 1;
    console.log(`${lineNum.toString().padStart(4)}: ${line}`);
  });
}

// 检查 <script> 和 <style> 标签的位置
const scriptStart = content.indexOf('<script');
const styleStart = content.indexOf('<style');
console.log('\n=== 其他标签位置 ===');
console.log('<script> 位置:', scriptStart);
console.log('<style> 位置:', styleStart);

if (styleStart !== -1) {
  const styleLine = content.substring(0, styleStart).split('\n').length;
  console.log('<style> 在第', styleLine, '行');
}

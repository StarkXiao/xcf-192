import { parse } from '@vue/compiler-sfc';
import fs from 'fs';

const content = fs.readFileSync('src/components/JournalEditor.vue', 'utf8');

try {
  const { descriptor, errors } = parse(content, {
    filename: 'JournalEditor.vue'
  });
  
  console.log('Parse errors:', errors.length);
  errors.forEach((err, idx) => {
    console.log(`\nError ${idx + 1}:`, err.message);
    console.log('  Location:', err.loc);
  });
  
  if (descriptor.template) {
    console.log('\n=== Analyzing template tags ===');
    const templateContent = descriptor.template.content;
    
    // 匹配所有的开始标签和结束标签
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>/g;
    const tags = [];
    let match;
    
    while ((match = tagRegex.exec(templateContent)) !== null) {
      const fullTag = match[0];
      const tagName = match[1];
      const isClosing = fullTag.startsWith('</');
      const isSelfClosing = match[2].includes('/>');
      
      // 计算行号
      const beforeMatch = templateContent.substring(0, match.index);
      const lineNumber = (beforeMatch.match(/\n/g) || []).length + 2; // +2 因为模板从第2行开始
      
      tags.push({
        tag: tagName,
        isClosing,
        isSelfClosing,
        line: lineNumber,
        fullTag: fullTag.substring(0, 50)
      });
    }
    
    // 检查标签平衡
    const stack = [];
    const unclosed = [];
    
    tags.forEach((t, idx) => {
      if (t.isSelfClosing) return;
      
      if (t.isClosing) {
        // 查找匹配的开始标签
        let found = false;
        for (let i = stack.length - 1; i >= 0; i--) {
          if (stack[i].tag === t.tag) {
            stack.splice(i, 1);
            found = true;
            break;
          }
        }
        if (!found) {
          console.log(`⚠️  多余的结束标签 at line ${t.line}: ${t.fullTag}`);
        }
      } else {
        stack.push(t);
      }
    });
    
    console.log(`\n=== 未关闭的标签 (${stack.length}) ===`);
    if (stack.length === 0) {
      console.log('✅ 所有标签都已正确关闭');
    } else {
      stack.forEach(t => {
        console.log(`  ❌ <${t.tag}> at line ${t.line}`);
      });
    }
    
    console.log(`\n=== 前20个标签 ===`);
    tags.slice(0, 20).forEach(t => {
      const type = t.isClosing ? 'closing' : t.isSelfClosing ? 'self-closing' : 'opening';
      console.log(`  ${type.padEnd(12)} <${t.tag}> at line ${t.line}`);
    });
    
    console.log(`\n=== 最后20个标签 ===`);
    tags.slice(-20).forEach(t => {
      const type = t.isClosing ? 'closing' : t.isSelfClosing ? 'self-closing' : 'opening';
      console.log(`  ${type.padEnd(12)} <${t.tag}> at line ${t.line}`);
    });
    
    console.log(`\n=== 总行数统计 ===`);
    console.log(`模板内容行数: ${(templateContent.match(/\n/g) || []).length + 1}`);
    console.log(`标签总数: ${tags.length}`);
  }
  
} catch (e) {
  console.log('Exception:', e.message);
  console.log(e.stack);
}

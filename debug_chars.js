import fs from 'fs';

const content = fs.readFileSync('src/components/JournalEditor.vue', 'utf8');
const lines = content.split('\n');

console.log('=== 第 1115-1125 行字符编码检查 ===');

for (let lineNum = 1114; lineNum < Math.min(1125, lines.length); lineNum++) {
  const line = lines[lineNum];
  const displayNum = lineNum + 1;
  const prefix = displayNum === 1119 ? '>>> ' : '    ';
  
  console.log(`\n${prefix}${displayNum}: ${line}`);
  
  // 显示每个字符的编码
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const code = char.charCodeAt(0);
    if (code < 32 || code > 126) {
      console.log(`  [${i}]: "${char}" (U+${code.toString(16).padStart(4, '0')})`);
    }
  }
  
  // 检查行尾
  if (line.endsWith('\r')) {
    console.log('  ⚠️  行尾有 CR 字符');
  }
}

// 检查第 41339-41360 位置的字符（offset 41350 附近）
console.log('\n=== 第 41339-41360 offset 附近的字符 ===');
for (let offset = 41339; offset < Math.min(41360, content.length); offset++) {
  const char = content[offset];
  const code = char.charCodeAt(0);
  const lineNum = content.substring(0, offset).split('\n').length;
  const display = code < 32 || code > 126 ? `U+${code.toString(16).padStart(4, '0')}` : `"${char}"`;
  const marker = offset === 41350 ? ' <<< ERROR OFFSET' : '';
  console.log(`  ${offset} (line ${lineNum}): ${display}${marker}`);
}

// 检查 </script> 标签周围
const scriptEnd = content.indexOf('</script>');
if (scriptEnd !== -1) {
  console.log('\n=== </script> 标签周围的字符 ===');
  console.log('位置:', scriptEnd);
  console.log('标签:', content.substring(scriptEnd, scriptEnd + 9));
  
  for (let offset = scriptEnd - 5; offset < scriptEnd + 20; offset++) {
    if (offset >= 0 && offset < content.length) {
      const char = content[offset];
      const code = char.charCodeAt(0);
      const display = code < 32 || code > 126 ? `U+${code.toString(16).padStart(4, '0')}` : `"${char}"`;
      const inTag = offset >= scriptEnd && offset < scriptEnd + 9 ? '*' : ' ';
      console.log(`  ${inTag} ${offset}: ${display}`);
    }
  }
}

// 检查整个文件中是否有 BOM
if (content.charCodeAt(0) === 0xfeff) {
  console.log('\n⚠️  文件开头有 BOM');
} else {
  console.log('\n✅ 文件开头没有 BOM');
}

// 检查是否有 null 字符
if (content.includes('\0')) {
  console.log('⚠️  文件包含 null 字符');
  const nullPositions = [];
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '\0') {
      nullPositions.push(i);
      if (nullPositions.length >= 5) break;
    }
  }
  console.log('  前5个位置:', nullPositions);
} else {
  console.log('✅ 文件不包含 null 字符');
}

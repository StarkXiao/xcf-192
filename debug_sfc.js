import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc';
import fs from 'fs';

const content = fs.readFileSync('src/components/JournalEditor.vue', 'utf8');

console.log('=== 使用 @vue/compiler-sfc 解析整个文件 ===');

try {
  const { descriptor, errors } = parse(content, {
    filename: 'JournalEditor.vue',
    sourceMap: true
  });
  
  console.log('解析错误:', errors.length);
  errors.forEach((err, idx) => {
    console.log(`\n错误 ${idx + 1}:`);
    console.log('  消息:', err.message);
    console.log('  位置:', err.loc);
    console.log('  代码:', err.code);
  });
  
  console.log('\n=== 文件结构 ===');
  console.log('模板:', descriptor.template ? '存在' : '不存在');
  console.log('脚本:', descriptor.script ? '存在' : '不存在');
  console.log('脚本Setup:', descriptor.scriptSetup ? '存在' : '不存在');
  console.log('样式:', descriptor.styles.length, '个');
  
  if (descriptor.template) {
    console.log('\n=== 编译模板 ===');
    try {
      const templateResult = compileTemplate({
        source: descriptor.template.content,
        filename: 'JournalEditor.vue',
        id: 'test',
        compilerOptions: {
          onError: (err) => {
            console.log('模板编译错误:', err.message);
            console.log('位置:', err.loc);
          }
        }
      });
      console.log('✅ 模板编译成功');
      console.log('生成代码长度:', templateResult.code.length);
    } catch (e) {
      console.log('❌ 模板编译异常:', e.message);
    }
  }
  
  if (descriptor.scriptSetup) {
    console.log('\n=== 编译脚本 ===');
    try {
      const scriptResult = compileScript(descriptor, {
        id: 'test',
        isProd: true
      });
      console.log('✅ 脚本编译成功');
      console.log('生成代码长度:', scriptResult.content.length);
    } catch (e) {
      console.log('❌ 脚本编译异常:', e.message);
      console.log(e.stack);
    }
  }
  
} catch (e) {
  console.log('❌ 解析异常:', e.message);
  console.log(e.stack);
}

// 检查文件的第 1119 行附近
console.log('\n=== 第 1115-1125 行内容 ===');
const lines = content.split('\n');
for (let i = 1114; i < Math.min(1125, lines.length); i++) {
  const prefix = i === 1118 ? '>>> ' : '    ';
  console.log(`${prefix}${i + 1}: ${lines[i]}`);
}

// 检查 script 部分的内容
console.log('\n=== 脚本部分开始和结束 ===');
const scriptStart = content.indexOf('<script setup>');
const scriptEnd = content.indexOf('</script>', scriptStart);
if (scriptStart !== -1 && scriptEnd !== -1) {
  console.log('<script setup> 位置:', scriptStart, '(行', content.substring(0, scriptStart).split('\n').length, ')');
  console.log('</script> 位置:', scriptEnd, '(行', content.substring(0, scriptEnd).split('\n').length, ')');
  
  // 检查脚本部分是否有 <template 字符串
  const scriptContent = content.substring(scriptStart, scriptEnd);
  if (scriptContent.includes('<template')) {
    console.log('⚠️  脚本部分包含 <template 字符串！');
    const idx = scriptContent.indexOf('<template');
    const lineNum = content.substring(0, scriptStart + idx).split('\n').length;
    console.log('  位置: 第', lineNum, '行');
    console.log('  附近内容:', scriptContent.substring(Math.max(0, idx - 20), idx + 50));
  } else {
    console.log('✅ 脚本部分不包含 <template 字符串');
  }
  
  if (scriptContent.includes('</template>')) {
    console.log('⚠️  脚本部分包含 </template> 字符串！');
    const idx = scriptContent.indexOf('</template>');
    const lineNum = content.substring(0, scriptStart + idx).split('\n').length;
    console.log('  位置: 第', lineNum, '行');
    console.log('  附近内容:', scriptContent.substring(Math.max(0, idx - 20), idx + 50));
  } else {
    console.log('✅ 脚本部分不包含 </template> 字符串');
  }
}

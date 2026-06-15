import { parse } from '@vue/compiler-sfc';
import fs from 'fs';

const content = fs.readFileSync('src/components/JournalEditor.vue', 'utf8');

try {
  const { descriptor, errors } = parse(content, {
    filename: 'JournalEditor.vue'
  });
  
  console.log('Parse errors:', errors.length);
  errors.forEach(err => {
    console.log('Error:', err.message);
    console.log('  Location:', err.loc);
  });
  
  console.log('\nDescriptor:');
  console.log('  template:', descriptor.template ? 'present' : 'missing');
  console.log('  script:', descriptor.script ? 'present' : 'missing');
  console.log('  scriptSetup:', descriptor.scriptSetup ? 'present' : 'missing');
  console.log('  styles:', descriptor.styles.length);
  
  if (descriptor.template) {
    console.log('\nTemplate content length:', descriptor.template.content.length);
    console.log('Template content (first 200 chars):', descriptor.template.content.slice(0, 200));
    console.log('Template content (last 200 chars):', descriptor.template.content.slice(-200));
  }
} catch (e) {
  console.log('Exception:', e.message);
  console.log(e.stack);
}

import re

with open('src/components/JournalEditor.vue', 'r') as f:
    lines = f.readlines()

self_closing = {'input', 'br', 'hr', 'img', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'}

in_template = False
tag_stack = []
template_start = 0
template_end = 0

for i, line in enumerate(lines):
    line_num = i + 1
    
    if '<template>' in line:
        in_template = True
        template_start = line_num
    if '</template>' in line:
        in_template = False
        template_end = line_num
        if tag_stack:
            print(f'After </template> at line {line_num}, unclosed tags:')
            for t in tag_stack[-5:]:
                print(f'  Line {t[1]}: <{t[0]}>')
        tag_stack = []
        continue
    
    if not in_template:
        continue
    
    tag_re = re.compile(r'<\/?([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>')
    for match in tag_re.finditer(line):
        is_closing = match.group(0).startswith('</')
        tag_name = match.group(1).lower()
        attrs = match.group(2)
        is_self_closing = tag_name in self_closing or attrs.strip().endswith('/')
        
        if is_self_closing and not is_closing:
            continue
        
        if is_closing:
            if tag_stack and tag_stack[-1][0] == tag_name:
                tag_stack.pop()
            else:
                print(f'Line {line_num}: Mismatched </{tag_name}>')
                print(f'  Context: {line.strip()[:80]}')
                if tag_stack:
                    last = tag_stack[-1]
                    print(f'  Expected </{last[0]}> (opened at line {last[1]})')
        else:
            tag_stack.append((tag_name, line_num))

print(f'\nTemplate: lines {template_start}-{template_end}')
print(f'Unclosed tags remaining: {len(tag_stack)}')
if tag_stack:
    print('First few unclosed:')
    for t in tag_stack[:5]:
        print(f'  Line {t[1]}: <{t[0]}>')

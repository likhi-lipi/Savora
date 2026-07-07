import os
import re

dir_path = r'c:\Users\Admin\Desktop\Projects\Savora\src'
count = 0
for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            orig_content = content
            
            # JSX and Template replacements
            content = content.replace('>${', '>₹{')
            content = content.replace('> ${', '> ₹{')
            content = content.replace('>$', '>₹')
            content = content.replace('> $', '> ₹')
            
            content = content.replace('$${', '₹${')
            content = content.replace('($${', '(₹${')
            content = content.replace(' $${', ' ₹${')
            
            # Dollar followed by number
            content = re.sub(r'\$(?=[0-9])', '₹', content)
            
            # Misc
            content = content.replace('$ Cash', '₹ Cash')
            content = content.replace('USD', 'INR')
            
            if content != orig_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                count += 1
                print(f'Updated {file}')
print(f'Total files updated: {count}')

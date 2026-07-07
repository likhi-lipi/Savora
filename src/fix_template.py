import os

directory = r'c:\Users\Admin\Desktop\Projects\Savora\src'

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            content = content.replace(' ₹{', ' ${')
            content = content.replace('\"₹{', '\"${')
            content = content.replace('\'₹{', '\'${')
            content = content.replace('>₹{', '>${')
            content = content.replace('`₹{', '`${')
            
            if original_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Fixed {filepath}')

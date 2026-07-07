import os
import re

directory = r'c:\Users\Admin\Desktop\Projects\Savora\src'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # Replace cases where $ is used as a currency symbol in TSX/JSX:
    # 1. $ followed by { in JSX, like <div>${amount}</div>
    # But wait, inside backticks `... ${var} ...`, $ is syntax.
    # To safely replace:
    # Replace \$([0-9]) with ₹\1  (e.g. $14,920 -> ₹14,920)
    # Replace \$\$\{ with ₹\$\{   (e.g. `$${amount}` -> `₹${amount}`)
    # Replace >\$ with >₹ (e.g. <div>$10</div> -> <div>₹10</div>)
    # Replace \(\$\) with (₹) (e.g. Revenue ($) -> Revenue (₹))
    # Replace \$\{(.*?)\} where it's clearly a currency in JSX. Since JSX uses <span>${amount}</span>
    # Wait, in TSX `<span>${amount}</span>` the $ is literal text and {amount} is expression.
    # If I just replace all `$` with `₹`, it will break template literals like `${var}`.
    # A template literal usually has a backtick before or around it.
    
    # We can use regex to find $ not preceded by a backtick and not inside a backtick string... this is hard in regex.
    
    # Let's do specific replacements based on the grep results we saw:
    content = content.replace("Revenue ($)", "Revenue (₹)")
    content = content.replace("($)", "(₹)")
    content = re.sub(r'\$(\d)', r'₹\1', content) # $ followed by digit
    content = content.replace("$${", "₹${") # template literal currency
    
    # Now for JSX currency like <span>${amount}</span>
    # we can look for >${ or  ${ and check if we are outside backticks.
    # Actually, simpler: in Savora, let's just replace all >\$ with >₹ and all \}\$ with \}₹
    content = content.replace(">$", ">₹")
    content = content.replace("} $", "} ₹")
    content = content.replace(":\n  $", ":\n  ₹")
    content = content.replace("= $", "= ₹")
    content = content.replace("  $", "  ₹")
    
    # Let's specifically target the files we found:
    # Customers.tsx: `${cust.totalSpent.toFixed(2)}` -> `₹${cust.totalSpent...}`
    # Dashboard.tsx: `${todayStats...}`
    # Employees.tsx: `${employee.salary}`? (didn't see)
    # POS.tsx: already has ₹
    
    # Custom targeted replacements:
    content = content.replace(">${", ">₹{")
    content = content.replace(" ${", " ₹{")
    content = content.replace('"${', '"₹{')
    content = content.replace("'${", "'₹{")
    # careful with string templates! ` ${` might be inside a template literal.
    
    if original_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            process_file(filepath)

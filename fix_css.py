import sys

with open('style.css', 'r') as f:
    content = f.read()

target = """  .popup-preview-wrap { height: 140px; }
  .popup-body { max-height: none; }"""

replacement = """  .popup-preview-wrap { display: none; }
  .popup-body { max-height: none; padding: 15px; }
  .popup-body h2 { font-size: 1.1rem; margin-bottom: 2px; }
  .popup-body .subtitle { font-size: 0.8rem; margin-bottom: 8px; }
  .popup-body .desc, .popup-body li { font-size: 0.85rem; line-height: 1.4; }"""

if target in content:
    content = content.replace(target, replacement)
    with open('style.css', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Target not found")

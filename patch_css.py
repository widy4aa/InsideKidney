import sys

with open('style.css', 'r') as f:
    content = f.read()

# Base CSS
target1 = "@media (max-width: 768px) {"
replacement1 = """/* ── Read More Base ─────────────────────────────────────── */
.btn-read-more {
  display: none;
}
.info-content-collapsible {
  display: block;
}

@media (max-width: 768px) {"""

# Mobile CSS
target2 = ".popup-body .desc, .popup-body li { font-size: 0.85rem; line-height: 1.4; }"
replacement2 = """.popup-body .desc, .popup-body li { font-size: 0.85rem; line-height: 1.4; }

  /* ── Read More Mobile ─────────────────────────────────────── */
  .btn-read-more {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 8px;
    background: rgba(0, 229, 255, 0.1);
    border: 1px solid rgba(0, 229, 255, 0.3);
    border-radius: 8px;
    color: var(--text-color);
    font-size: 0.85rem;
    cursor: pointer;
    margin-bottom: 10px;
    transition: all 0.3s ease;
  }
  .btn-read-more .chevron {
    transition: transform 0.3s ease;
  }
  #info-popup:not(.expanded) .info-content-collapsible {
    display: none;
  }
  #info-popup.expanded .info-content-collapsible {
    display: block;
  }
  #info-popup.expanded .btn-read-more .chevron {
    transform: rotate(180deg);
  }"""

if target1 in content and target2 in content:
    content = content.replace(target1, replacement1, 1)
    content = content.replace(target2, replacement2, 1)
    with open('style.css', 'w') as f:
        f.write(content)
    print("CSS Patched")
else:
    print("Targets not found")

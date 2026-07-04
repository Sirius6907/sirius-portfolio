import sys
sys.path.insert(0, '/usr/lib/python3/dist-packages')
from playwright.sync_api import sync_playwright
import os

html_path = "/mnt/c/Users/opcha/Downloads/Portfolio-main/Portfolio-main/resume-build/resume.html"
pdf_path = "/mnt/c/Users/opcha/Downloads/Portfolio-main/Portfolio-main/resume-build/Chandan_Kumar_Behera_Resume.pdf"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(f"file://{html_path}")
    page.wait_for_load_state("networkidle")
    page.pdf(path=pdf_path, format="A4", print_background=True, margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
    browser.close()
    print(f"PDF created: {pdf_path}")
    print(f"Size: {os.path.getsize(pdf_path)} bytes")

import os
import sys
import tempfile
import subprocess
import html
from datetime import datetime
from typing import Dict, Any, Optional

CHROME_PATHS = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
]

def find_chrome_binary() -> Optional[str]:
    for path in CHROME_PATHS:
        if os.path.exists(path):
            return path
    return None

def build_species_html(species: Dict[str, Any]) -> str:
    common_name = html.escape(species.get("common_name") or "Unknown Species")
    scientific_name = html.escape(species.get("scientific_name") or "Species incertae sedis")
    genus = html.escape(species.get("genus") or "N/A")
    family = html.escape(species.get("family") or "N/A")
    order = html.escape(species.get("order") or "N/A")
    conservation_status = html.escape(species.get("conservation_status") or "Least Concern (LC)")
    description = html.escape(species.get("description") or "Biological profile compiled via multimodal artificial intelligence.")
    habitat = html.escape(species.get("habitat") or "Forests, woodlands, wetlands, and open vegetative ecosystems.")
    diet = html.escape(species.get("diet") or "Invertebrates, seeds, wild fruits, and seasonal foliage.")
    physical = html.escape(species.get("physical_characteristics") or "Tailored plumage coloration, wing morphometrics, and specialized beak adaptations.")
    distribution = html.escape(species.get("geographical_distribution") or "Native or migratory distribution documented across regional biodiversity registers.")
    image_url = species.get("image_url") or ""

    # Status badge color
    status_lower = conservation_status.lower()
    badge_bg = "#ecfdf5"
    badge_color = "#065f46"
    badge_border = "#a7f3d0"
    if "critically" in status_lower or "endangered" in status_lower:
        badge_bg = "#fef2f2"
        badge_color = "#991b1b"
        badge_border = "#fecaca"
    elif "vulnerable" in status_lower or "near" in status_lower:
        badge_bg = "#fffbeb"
        badge_color = "#92400e"
        badge_border = "#fde68a"

    current_date = datetime.now().strftime("%B %d, %Y")

    image_html = ""
    if image_url:
        image_html = f"""
        <div class="photo-banner">
          <img src="{image_url}" alt="{common_name}" onerror="this.parentElement.style.display='none';" />
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{common_name} — Drishti Field Dossier</title>
  <style>
    @page {{
      size: A4 portrait;
      margin: 12mm 15mm;
    }}
    * {{
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11pt;
      line-height: 1.5;
    }}
    .header-bar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #059669;
      padding-bottom: 10px;
      margin-bottom: 16px;
    }}
    .brand-title {{
      font-size: 22pt;
      font-weight: 900;
      color: #065f46;
      letter-spacing: -0.5px;
      margin: 0;
    }}
    .brand-sub {{
      font-size: 8.5pt;
      font-weight: 700;
      color: #059669;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 2px;
    }}
    .header-meta {{
      text-align: right;
      font-size: 8pt;
      color: #64748b;
      line-height: 1.35;
    }}
    .title-area {{
      margin-bottom: 12px;
    }}
    .species-name {{
      font-size: 24pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin: 0 0 4px 0;
    }}
    .scientific-name {{
      font-size: 13pt;
      font-style: italic;
      color: #047857;
      font-family: Georgia, "Times New Roman", serif;
      margin: 0 0 10px 0;
    }}
    .badge-strip {{
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 14px;
    }}
    .badge {{
      display: inline-block;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 8pt;
      font-weight: 700;
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
    }}
    .badge-iucn {{
      background: {badge_bg};
      color: {badge_color};
      border-color: {badge_border};
    }}
    .photo-banner {{
      width: 100%;
      height: 200px;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 14px;
      background: #0f172a;
      border: 1px solid #e2e8f0;
    }}
    .photo-banner img {{
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }}
    .summary-card {{
      background: #f8fafc;
      border-left: 4px solid #059669;
      border-radius: 6px 12px 12px 6px;
      padding: 10px 14px;
      font-size: 9.5pt;
      color: #334155;
      margin-bottom: 14px;
      line-height: 1.55;
    }}
    .taxonomy-table {{
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 8.5pt;
    }}
    .taxonomy-table th, .taxonomy-table td {{
      padding: 5px 10px;
      text-align: left;
      border: 1px solid #e2e8f0;
    }}
    .taxonomy-table th {{
      background: #f1f5f9;
      color: #475569;
      font-weight: 700;
      width: 25%;
    }}
    .taxonomy-table td {{
      background: #ffffff;
      color: #1e293b;
      font-weight: 600;
    }}
    .grid-sections {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }}
    .section-card {{
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 12px;
      background: #ffffff;
    }}
    .section-title {{
      font-size: 8pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #059669;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }}
    .section-body {{
      font-size: 9pt;
      color: #1e293b;
      margin: 0;
      line-height: 1.45;
    }}
    .sources-box {{
      font-size: 7.5pt;
      color: #64748b;
      background: #fafafa;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 6px 10px;
      margin-bottom: 14px;
    }}
    .footer-bar {{
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      font-size: 7.5pt;
      color: #94a3b8;
    }}
  </style>
</head>
<body>
  <div class="header-bar">
    <div>
      <div class="brand-title">Drishti</div>
      <div class="brand-sub">AI Multimodal Avian Identification</div>
    </div>
    <div class="header-meta">
      <div><b>Official Avian Species Field Dossier</b></div>
      <div>Generated on {current_date}</div>
      <div>Multimodal AI Classification Engine</div>
    </div>
  </div>

  <div class="title-area">
    <h1 class="species-name">{common_name}</h1>
    <div class="scientific-name">{scientific_name}</div>
    <div class="badge-strip">
      <span class="badge badge-iucn">{conservation_status}</span>
      <span class="badge">Genus: <i>{genus}</i></span>
      <span class="badge">Family: {family}</span>
      <span class="badge">Order: {order}</span>
    </div>
  </div>

  {image_html}

  <div class="summary-card">
    <b>Ecological Summary:</b> {description}
  </div>

  <table class="taxonomy-table">
    <tr>
      <th>Order</th>
      <td>{order}</td>
      <th>Family</th>
      <td>{family}</td>
    </tr>
    <tr>
      <th>Genus</th>
      <td><i>{genus}</i></td>
      <th>Conservation Rating</th>
      <td>{conservation_status}</td>
    </tr>
  </table>

  <div class="grid-sections">
    <div class="section-card">
      <div class="section-title">Natural Habitat</div>
      <p class="section-body">{habitat}</p>
    </div>
    <div class="section-card">
      <div class="section-title">Diet & Ecological Niche</div>
      <p class="section-body">{diet}</p>
    </div>
    <div class="section-card">
      <div class="section-title">Physical Traits & Morphology</div>
      <p class="section-body">{physical}</p>
    </div>
    <div class="section-card">
      <div class="section-title">Geographical Distribution</div>
      <p class="section-body">{distribution}</p>
    </div>
  </div>

  <div class="sources-box">
    <b>Scientific Reference Sources:</b> IUCN Red List of Threatened Species &bull; eBird (Cornell Lab of Ornithology) &bull; Birds of the World &bull; Drishti Verified Taxonomy Registry.
  </div>

  <div class="footer-bar">
    <div>Drishti Avian AI System &bull; Autonomous Multimodal Field Report</div>
    <div>Document Reference: DRISHTI-SPEC-{abs(hash(common_name)) % 1000000:06d} &bull; Page 1 of 1</div>
  </div>
</body>
</html>"""

def generate_species_pdf_bytes(species: Dict[str, Any]) -> bytes:
    chrome_bin = find_chrome_binary()
    if not chrome_bin:
        raise RuntimeError("Google Chrome binary not found on system for PDF printing.")

    html_source = build_species_html(species)

    temp_dir = tempfile.gettempdir()
    unique_id = os.urandom(6).hex()
    temp_html = os.path.join(temp_dir, f"species_{unique_id}.html")
    temp_pdf = os.path.join(temp_dir, f"species_{unique_id}.pdf")

    try:
        with open(temp_html, "w", encoding="utf-8") as f:
            f.write(html_source)

        cmd = [
            chrome_bin,
            "--headless=new",
            "--no-sandbox",
            "--disable-gpu",
            "--run-all-compositor-stages-before-draw",
            f"--print-to-pdf={temp_pdf}",
            temp_html
        ]

        res = subprocess.run(cmd, capture_output=True, timeout=20)
        if res.returncode != 0:
            raise RuntimeError(f"Chrome PDF generation failed with code {res.returncode}: {res.stderr.decode('utf-8', errors='ignore')}")

        if not os.path.exists(temp_pdf):
            raise RuntimeError("PDF output file was not created by Chrome.")

        with open(temp_pdf, "rb") as f:
            pdf_bytes = f.read()

        return pdf_bytes

    finally:
        for p in [temp_html, temp_pdf]:
            if os.path.exists(p):
                try:
                    os.remove(p)
                except OSError:
                    pass


import os
import subprocess
import base64

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PDF = os.path.join(PROJECT_ROOT, "Drishti_Project_Report.pdf")
HTML_FILE = os.path.join(PROJECT_ROOT, "report_printable.html")

# Read local image if available for screenshots
peacock_img_path = os.path.join(PROJECT_ROOT, "data", "raw", "000.Indian_Peafowl", "000.jpg")
peacock_b64 = ""
if os.path.exists(peacock_img_path):
    with open(peacock_img_path, "rb") as f:
        peacock_b64 = "data:image/jpeg;base64," + base64.b64encode(f.read()).decode("utf-8")

mel_img_path = os.path.join(PROJECT_ROOT, "tests", "test_assets", "test_mel_spectrogram.png")
mel_b64 = ""
if os.path.exists(mel_img_path):
    with open(mel_img_path, "rb") as f:
        mel_b64 = "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Drishti - Project Report</title>
<style>
  @page {{
    size: A4;
    margin: 25mm 20mm 20mm 25mm;
    @bottom-right {{
      content: counter(page);
      font-family: "Times New Roman", Times, serif;
      font-size: 10pt;
    }}
  }}

  body {{
    font-family: "Times New Roman", Times, serif;
    font-size: 12pt;
    line-height: 1.6;
    color: #111;
    margin: 0;
    padding: 0;
    text-align: justify;
  }}

  .page {{
    page-break-after: always;
    position: relative;
    box-sizing: border-box;
  }}

  .center {{
    text-align: center;
  }}

  h1.univ-title {{
    font-size: 15pt;
    font-weight: bold;
    color: #8b0000;
    margin: 0 0 4px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    line-height: 1.3;
  }}

  h2.univ-sub {{
    font-size: 11pt;
    font-weight: bold;
    color: #111;
    margin: 0 0 25px 0;
  }}

  .emblem-box {{
    margin: 25px auto;
    width: 105px;
    height: 105px;
    border: 3px double #b8860b;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle, #fffdf0 0%, #fff 70%);
    box-shadow: 0 0 10px rgba(184, 134, 11, 0.2);
  }}

  .emblem-inner {{
    font-size: 9pt;
    font-weight: bold;
    color: #8b0000;
    text-align: center;
    line-height: 1.2;
    padding: 5px;
  }}

  h2.report-on {{
    font-size: 13pt;
    font-weight: bold;
    margin: 20px 0 6px 0;
    letter-spacing: 1px;
  }}

  h1.proj-title {{
    font-size: 18pt;
    font-weight: bold;
    color: #8b0000;
    margin: 6px 0 20px 0;
    line-height: 1.3;
  }}

  p.degree-sub {{
    font-size: 11pt;
    font-style: italic;
    margin: 0 0 4px 0;
  }}

  h3.degree-title {{
    font-size: 13pt;
    font-weight: bold;
    margin: 0 0 35px 0;
    letter-spacing: 0.5px;
  }}

  .meta-grid {{
    width: 100%;
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
  }}

  .meta-col {{
    width: 48%;
  }}

  table.meta-table {{
    width: 70%;
    margin: 0 auto;
    border-collapse: collapse;
  }}

  table.meta-table td {{
    padding: 3px 8px;
    font-size: 12pt;
  }}

  table.meta-table td.label {{
    font-weight: bold;
    width: 35%;
  }}

  h4.guide-head {{
    font-size: 11pt;
    font-weight: bold;
    margin: 30px 0 2px 0;
  }}

  p.guide-name {{
    font-size: 12pt;
    font-weight: bold;
    color: #8b0000;
    margin: 0;
  }}

  p.guide-desig {{
    font-size: 11pt;
    margin: 2px 0 25px 0;
    line-height: 1.3;
  }}

  .college-footer {{
    margin-top: 35px;
  }}

  .college-footer h3 {{
    font-size: 12pt;
    font-weight: bold;
    color: #8b0000;
    margin: 0 0 2px 0;
  }}

  .college-footer h4 {{
    font-size: 11pt;
    font-weight: bold;
    color: #111;
    margin: 0 0 3px 0;
  }}

  .college-footer p {{
    font-size: 9.5pt;
    margin: 1px 0;
    line-height: 1.3;
  }}

  /* Certificate Styling */
  .cert-header {{
    text-align: center;
    margin-bottom: 25px;
  }}

  .cert-header h2 {{
    font-size: 13pt;
    font-weight: bold;
    color: #8b0000;
    margin: 0;
  }}

  .cert-header p {{
    font-size: 9pt;
    margin: 2px 0;
  }}

  .cert-header h3 {{
    font-size: 11pt;
    font-weight: bold;
    margin: 8px 0 0 0;
    letter-spacing: 0.5px;
  }}

  h1.cert-title {{
    font-size: 16pt;
    font-weight: bold;
    text-align: center;
    letter-spacing: 2px;
    margin: 30px 0 20px 0;
    text-decoration: underline;
  }}

  p.cert-body {{
    font-size: 12pt;
    line-height: 1.8;
    text-align: justify;
    text-indent: 40px;
    margin: 20px 0;
  }}

  .cert-highlight {{
    color: #8b0000;
    font-weight: bold;
  }}

  .sig-table {{
    width: 100%;
    margin-top: 90px;
    border-collapse: collapse;
  }}

  .sig-table td {{
    width: 50%;
    vertical-align: top;
    font-size: 11.5pt;
    line-height: 1.4;
  }}

  /* Content Headings */
  h1.chap-num {{
    font-size: 14pt;
    font-weight: bold;
    text-align: center;
    margin: 30px 0 5px 0;
  }}

  h1.chap-title {{
    font-size: 16pt;
    font-weight: bold;
    text-align: center;
    margin: 0 0 30px 0;
    letter-spacing: 0.5px;
  }}

  h2.sec-title {{
    font-size: 13pt;
    font-weight: bold;
    margin: 22px 0 8px 0;
    color: #111;
  }}

  h3.subsec-title {{
    font-size: 12pt;
    font-weight: bold;
    margin: 16px 0 6px 0;
  }}

  p {{
    margin: 8px 0 12px 0;
    text-indent: 25px;
  }}

  p.noindent {{
    text-indent: 0;
  }}

  ul, ol {{
    margin: 8px 0 12px 25px;
    padding: 0;
  }}

  li {{
    margin-bottom: 6px;
    line-height: 1.5;
  }}

  /* Tables */
  table.data-table {{
    width: 100%;
    border-collapse: collapse;
    margin: 18px 0;
    font-size: 10.5pt;
  }}

  table.data-table th, table.data-table td {{
    border: 1px solid #444;
    padding: 7px 10px;
    text-align: left;
    vertical-align: top;
  }}

  table.data-table th {{
    background-color: #f2f2f2;
    font-weight: bold;
  }}

  .caption {{
    font-size: 10.5pt;
    font-weight: bold;
    text-align: center;
    margin: 8px 0 18px 0;
  }}

  .table-caption {{
    font-size: 10.5pt;
    font-weight: bold;
    text-align: left;
    margin: 12px 0 6px 0;
  }}

  /* Diagrams & UI boxes */
  .diagram-box {{
    border: 1px solid #777;
    background: #fafafa;
    border-radius: 6px;
    padding: 12px;
    margin: 15px 0;
    font-family: "Courier New", Courier, monospace;
    font-size: 8.5pt;
    white-space: pre;
    line-height: 1.25;
    overflow-x: auto;
  }}

  .img-frame {{
    text-align: center;
    margin: 15px 0;
  }}

  .img-frame img {{
    max-width: 80%;
    max-height: 200px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
  }}

  .formula-box {{
    background: #fdfdfd;
    border-left: 3px solid #8b0000;
    padding: 8px 15px;
    margin: 14px 0;
    font-style: italic;
    font-size: 11pt;
  }}

  /* Table of Contents dots */
  .toc-row {{
    display: flex;
    justify-content: space-between;
    margin: 4px 0;
    font-size: 11.5pt;
  }}

  .toc-title {{
    background: #fff;
    padding-right: 5px;
  }}

  .toc-leader {{
    flex-grow: 1;
    border-bottom: 1px dotted #555;
    margin: 0 5px 4px 5px;
  }}

  .toc-page {{
    background: #fff;
    padding-left: 5px;
    font-weight: bold;
  }}
</style>
</head>
<body>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- PAGE 1: TITLE PAGE -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="page center">
  <h1 class="univ-title">VISVESVARAYA TECHNOLOGICAL UNIVERSITY</h1>
  <h2 class="univ-sub">JNANA SANGAMA, BELAGAVI – 590 018, KARNATAKA, INDIA</h2>

  <div class="emblem-box">
    <div class="emblem-inner">
      VTU<br>BELAGAVI<br>★ 1998 ★
    </div>
  </div>

  <h2 class="report-on">A PROJECT REPORT<br>ON</h2>
  <h1 class="proj-title">“Drishti – AI-Based Multimodal Bird Species Identification System”</h1>

  <p class="degree-sub">Submitted in partial fulfillment of the requirements for the award of</p>
  <h3 class="degree-title">MASTER OF COMPUTER APPLICATIONS (MCA)</h3>

  <p class="noindent" style="font-size: 11pt; font-weight: bold; margin-bottom: 6px;">Submitted By</p>
  <table class="meta-table">
    <tr>
      <td class="label" style="text-align: right;">Name :</td>
      <td style="font-weight: bold; text-align: left;">Hithesh K</td>
    </tr>
    <tr>
      <td class="label" style="text-align: right;">USN :</td>
      <td style="font-weight: bold; text-align: left;">4VP25MC014</td>
    </tr>
  </table>

  <h4 class="guide-head">Under the Guidance of</h4>
  <p class="guide-name">Prof. Neema H</p>
  <p class="guide-desig">Assistant Professor<br>Department of Master of Computer Applications<br>Vivekananda College of Engineering & Technology</p>

  <div class="college-footer">
    <div class="emblem-box" style="width: 75px; height: 75px; margin: 10px auto;">
      <div class="emblem-inner" style="font-size: 7pt;">VCET<br>PUTTUR<br>Est. 2001</div>
    </div>
    <h3>DEPARTMENT OF MASTER OF COMPUTER APPLICATIONS</h3>
    <h4>VIVEKANANDA COLLEGE OF ENGINEERING & TECHNOLOGY</h4>
    <p>[A Unit of Vivekananda Vidyavardhaka Sangha, Puttur (R)]</p>
    <p>Affiliated to Visvesvaraya Technological University and Approved by AICTE New Delhi & Govt. of Karnataka</p>
    <p>Nehru Nagara, Puttur – 574 203, DK, Karnataka, India</p>
    <p style="font-weight: bold; margin-top: 8px;">July 2026</p>
  </div>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- PAGE 2: CERTIFICATE -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="cert-header">
    <h2>VIVEKANANDA COLLEGE OF ENGINEERING & TECHNOLOGY</h2>
    <p>[A Unit of Vivekananda Vidyavardhaka Sangha, Puttur (R)]</p>
    <p>Affiliated to Visvesvaraya Technological University and Approved by AICTE New Delhi & Govt. of Karnataka</p>
    <p>Nehru Nagara, Puttur – 574 203, DK, Karnataka, India</p>
    <h3>DEPARTMENT OF MASTER OF COMPUTER APPLICATIONS</h3>
  </div>

  <div class="emblem-box" style="width: 80px; height: 80px; margin: 15px auto;">
    <div class="emblem-inner" style="font-size: 7.5pt;">VCET<br>PUTTUR<br>MCA</div>
  </div>

  <h1 class="cert-title">CERTIFICATE</h1>

  <p class="cert-body">
    Certified that the project work entitled <span class="cert-highlight">“Drishti – AI-Based Multimodal Bird Species Identification System”</span> is carried out by <span class="cert-highlight">Hithesh K</span> bearing <span class="cert-highlight">USN 4VP25MC014</span>, a bonafide student of <b>Vivekananda College of Engineering & Technology</b>, in partial fulfillment for the award of <b>Master of Computer Applications (MCA)</b> of the <span class="cert-highlight">Visvesvaraya Technological University, Belagavi</span> during the academic year <b>2025–2026</b>. It is certified that all corrections/suggestions indicated for Internal Assessment have been incorporated in the report deposited in the departmental library.
  </p>

  <p class="cert-body">
    The project report has been approved as it satisfies the academic requirements in respect of Project work prescribed for the said Degree.
  </p>

  <table class="sig-table">
    <tr>
      <td style="text-align: left;">
        __________________________________<br>
        <b>Signature of the Guide</b><br>
        <b>Prof. Neema H</b><br>
        Assistant Professor<br>
        VCET, Puttur
      </td>
      <td style="text-align: right;">
        __________________________________<br>
        <b>Signature of the HOD</b><br>
        <b>Dr. Jothimani K</b><br>
        Director – Dept. of MCA<br>
        VCET, Puttur
      </td>
    </tr>
  </table>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- PAGE 3: ABSTRACT -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="page">
  <h1 class="chap-title" style="margin-top: 40px; text-decoration: underline;">ABSTRACT</h1>

  <p>
    <b>Drishti – AI-Based Multimodal Bird Species Identification System</b> is an advanced full-stack artificial intelligence application engineered to automate and enhance avian species identification worldwide through multimodal inputs: photographic imagery and bioacoustic audio recordings. Traditional field ornithology and ecological surveys have long been constrained by manual observation burdens, human perceptual limits, geographic restrictions, and rigid static species databases. Drishti resolves these bottlenecks by combining modern deep learning vision networks, acoustic signal transformations, and cloud multimodal cognitive services into an intuitive, responsive, and secure web platform.
  </p>

  <p>
    The system is developed using <b>HTML5</b>, <b>Tailwind CSS</b>, and <b>React.js</b> for the presentation layer, while <b>Python</b> and <b>FastAPI</b> drive the high-throughput asynchronous backend services and model dispatchers. Identification is executed via a dual-engine architecture: visual photographs are classified using Google Gemini Vision backed by localized <b>MobileNetV2</b> networks, with <b>Grad-CAM</b> (Gradient-weighted Class Activation Mapping) generating visual attention heatmaps that highlight diagnostic plumage characteristics. For acoustic vocalizations, <b>Librosa</b> processes the audio through Short-Time Fourier Transform (STFT) to compute <b>Mel-frequency spectrograms</b> across characteristic avian bands (1.5 kHz to 8.5 kHz), which are subsequently matched against harmonic signatures. Domain-specific verification gatekeepers validate uploads, strictly rejecting non-bird photographs and non-avian audio before downstream inference.
  </p>

  <p>
    Following identification, the system dynamically retrieves a comprehensive 6-section biological profile conforming to IUCN Red List and Cornell Lab of Ornithology scientific taxonomy: Basic Identification, Physical Characteristics & Sexual Dimorphism, Natural Habitat & Global Distribution, Feeding Habits & Foraging Behavior, Lifestyle & Breeding, and Ecological Novelty. Data persistence is managed through a hybrid model: <b>MongoDB</b> stores polymorphic identification telemetry and aggregate statistics, while <b>SQLite</b> secures user account records with salted SHA-256 password hashing. A strict authentication gate ensures that unauthenticated guests cannot access the dashboard or identification services without signing in or registering, delivering a robust, scalable, and scientifically validated tool for global ecological conservation.
  </p>

  <p class="noindent" style="margin-top: 25px;">
    <b>Keywords:</b> Drishti, Multimodal AI, Bird Species Identification, Computer Vision, Bioacoustics, Mel Spectrogram, Grad-CAM, FastAPI, React.js, Tailwind CSS, MongoDB, SQLite Authentication, IUCN Red List, Citizen Science.
  </p>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- PAGE 4: TABLE OF CONTENTS -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="page">
  <h1 class="chap-title" style="margin-top: 30px;">Table of Contents</h1>

  <div class="toc-row"><b>Table of Contents</b><span class="toc-leader"></span><span class="toc-page">i</span></div>
  <div class="toc-row"><b>List of Figures</b><span class="toc-leader"></span><span class="toc-page">iii</span></div>
  <div class="toc-row"><b>List of Tables</b><span class="toc-leader"></span><span class="toc-page">iv</span></div>
  <br>

  <div class="toc-row"><b>1 Introduction</b><span class="toc-leader"></span><span class="toc-page">1</span></div>
  <div class="toc-row" style="padding-left: 20px;">1.1 Project Introduction<span class="toc-leader"></span><span class="toc-page">1</span></div>
  <div class="toc-row" style="padding-left: 20px;">1.2 Problem Statement<span class="toc-leader"></span><span class="toc-page">1</span></div>
  <div class="toc-row" style="padding-left: 20px;">1.3 Objectives<span class="toc-leader"></span><span class="toc-page">1</span></div>
  <div class="toc-row" style="padding-left: 20px;">1.4 Scope<span class="toc-leader"></span><span class="toc-page">2</span></div>
  <br>

  <div class="toc-row"><b>2 Proposed System</b><span class="toc-leader"></span><span class="toc-page">3</span></div>
  <br>

  <div class="toc-row"><b>3 Requirements Specification</b><span class="toc-leader"></span><span class="toc-page">4</span></div>
  <div class="toc-row" style="padding-left: 20px;">3.1 Hardware Requirements<span class="toc-leader"></span><span class="toc-page">4</span></div>
  <div class="toc-row" style="padding-left: 20px;">3.2 Software Requirements<span class="toc-leader"></span><span class="toc-page">4</span></div>
  <br>

  <div class="toc-row"><b>4 System Design</b><span class="toc-leader"></span><span class="toc-page">5</span></div>
  <div class="toc-row" style="padding-left: 20px;">4.1 System Architecture<span class="toc-leader"></span><span class="toc-page">5</span></div>
  <div class="toc-row" style="padding-left: 20px;">4.2 Data Flow Diagram (DFD)<span class="toc-leader"></span><span class="toc-page">5</span></div>
  <div class="toc-row" style="padding-left: 40px;">4.2.1 Level 0 Data Flow Diagram (Context Diagram)<span class="toc-leader"></span><span class="toc-page">5</span></div>
  <div class="toc-row" style="padding-left: 40px;">4.2.2 Level 1 Data Flow Diagram (Architectural Decomposition)<span class="toc-leader"></span><span class="toc-page">6</span></div>
  <div class="toc-row" style="padding-left: 20px;">4.3 Database Design<span class="toc-leader"></span><span class="toc-page">6</span></div>
  <br>

  <div class="toc-row"><b>5 Implementation</b><span class="toc-leader"></span><span class="toc-page">8</span></div>
  <div class="toc-row" style="padding-left: 20px;">5.1 Frontend Screens & UI Logic<span class="toc-leader"></span><span class="toc-page">8</span></div>
  <div class="toc-row" style="padding-left: 20px;">5.2 Backend API & Routing<span class="toc-leader"></span><span class="toc-page">8</span></div>
  <div class="toc-row" style="padding-left: 20px;">5.3 Multimodal AI Vision & Bioacoustic Classification Engine<span class="toc-leader"></span><span class="toc-page">8</span></div>
  <div class="toc-row" style="padding-left: 20px;">5.4 Database Connectivity & Security<span class="toc-leader"></span><span class="toc-page">9</span></div>
  <br>

  <div class="toc-row"><b>6 Results and Screenshots</b><span class="toc-leader"></span><span class="toc-page">10</span></div>
  <div class="toc-row" style="padding-left: 20px;">6.1 Home Page & Landing Portal<span class="toc-leader"></span><span class="toc-page">10</span></div>
  <div class="toc-row" style="padding-left: 20px;">6.2 Authentication Pages (Login/Registration)<span class="toc-leader"></span><span class="toc-page">10</span></div>
  <div class="toc-row" style="padding-left: 20px;">6.3 Central Dashboard<span class="toc-leader"></span><span class="toc-page">11</span></div>
  <div class="toc-row" style="padding-left: 20px;">6.4 Image-Based Bird Identification & Grad-CAM Analysis<span class="toc-leader"></span><span class="toc-page">11</span></div>
  <div class="toc-row" style="padding-left: 20px;">6.5 Audio-Based Bioacoustic Identification & Mel Spectrogram<span class="toc-leader"></span><span class="toc-page">12</span></div>
  <div class="toc-row" style="padding-left: 20px;">6.6 Structured 6-Section Avian Biological Profile & History Log<span class="toc-leader"></span><span class="toc-page">12</span></div>
  <br>

  <div class="toc-row"><b>7 Conclusion</b><span class="toc-leader"></span><span class="toc-page">14</span></div>
  <br>
  <div class="toc-row"><b>8 Future Enhancements</b><span class="toc-leader"></span><span class="toc-page">15</span></div>
  <div class="toc-row" style="padding-left: 20px;">8.1 Future Enhancements<span class="toc-leader"></span><span class="toc-page">15</span></div>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- PAGE 5: LIST OF FIGURES & LIST OF TABLES -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="page">
  <h1 class="chap-title" style="margin-top: 30px;">List of Figures</h1>
  <div class="toc-row">4.1 Level 0 Context Diagram: Drishti Multimodal System<span class="toc-leader"></span><span class="toc-page">6</span></div>
  <div class="toc-row">4.2 Level 1 Data Flow Diagram: Architectural Decomposition<span class="toc-leader"></span><span class="toc-page">6</span></div>
  <div class="toc-row">6.1 Home Page & Landing Portal of the Drishti System<span class="toc-leader"></span><span class="toc-page">10</span></div>
  <div class="toc-row">6.2 User Login and Registration Security Pages<span class="toc-leader"></span><span class="toc-page">11</span></div>
  <div class="toc-row">6.3 Central Avian Intelligence Dashboard<span class="toc-leader"></span><span class="toc-page">11</span></div>
  <div class="toc-row">6.4 Image-Based Identification with Grad-CAM Attention Heatmap<span class="toc-leader"></span><span class="toc-page">12</span></div>
  <div class="toc-row">6.5 Audio-Based Bioacoustic Identification & Mel Spectrogram<span class="toc-leader"></span><span class="toc-page">12</span></div>
  <div class="toc-row">6.6 Multimodal History Log and 6-Section Biological Profile<span class="toc-leader"></span><span class="toc-page">13</span></div>

  <br><br>
  <h1 class="chap-title">List of Tables</h1>
  <div class="toc-row">3.1 Hardware Requirements Specification<span class="toc-leader"></span><span class="toc-page">4</span></div>
  <div class="toc-row">3.2 Software Requirements Specification<span class="toc-leader"></span><span class="toc-page">4</span></div>
  <div class="toc-row">4.1 Database Table and Collection Specifications<span class="toc-leader"></span><span class="toc-page">7</span></div>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- PAGE 6: CHAPTER 1 - INTRODUCTION -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="page">
  <h1 class="chap-num">Chapter 1</h1>
  <h1 class="chap-title">Introduction</h1>

  <h2 class="sec-title">1.1 Project Introduction</h2>
  <p>
    Birds are vital indicators of global biodiversity and ecosystem balance. They act as apex seed dispersers, pollinators, and natural insect controllers across natural and agricultural biomes. Monitoring avian populations is crucial for environmental research, conservation planning, and biodiversity reporting. <b>Drishti – AI-Based Multimodal Bird Species Identification System</b> is a full-stack artificial intelligence application engineered to automate and democratize avian recognition worldwide.
  </p>
  <p>
    Drishti provides a centralized, reactive platform for naturalists, researchers, and citizen scientists. The system supports multimodal recognition through two primary pathways: <b>photographic imagery</b> and <b>bioacoustic audio recordings</b>. Departing from legacy applications that enforce artificial restrictions (such as limiting recognition to a fixed set of 100 Indian species), Drishti identifies bird species globally (Asian, African, European, American, and Oceanic avifauna). Integrated gatekeeper validation algorithms ensure that non-bird imagery and ambient audio noise are rejected. Following classification, the system dynamically compiles an authentic, standardized 6-section biological profile conforming to IUCN Red List and Cornell Lab of Ornithology standards.
  </p>

  <h2 class="sec-title">1.2 Problem Statement</h2>
  <p>
    Traditional avian observation relies heavily on field guides, binoculars, and human expert verification, which is labor-intensive, error-prone, and inaccessible to non-specialists. Existing computational approaches suffer from several core vulnerabilities:
  </p>
  <ul>
    <li><b>Mono-Modal Inadequacy:</b> Vision-only systems fail when birds are concealed in dense forest canopies, while audio-only systems fail when birds are perched silently.</li>
    <li><b>Rigid Catalogue Bottlenecks:</b> Many systems depend on fixed databases of 100 regional species, completely failing when encountering uncatalogued native or migratory birds.</li>
    <li><b>Lack of Presence Validation:</b> Standard neural classifiers force arbitrary objects (such as vehicles, domestic pets, or portraits) into bird classes with false confidence.</li>
    <li><b>Absence of Explainability:</b> Black-box classifiers provide names without showing what visual features or acoustic harmonics dictated the decision.</li>
    <li><b>Insecure Guest Access:</b> Ungated access leads to database pollution and prevents persistent observation history tracking.</li>
  </ul>
  <p class="noindent">
    Therefore, there is a distinct need for a secure, web-based multimodal platform that combines robust verification gatekeepers, global avian recognition, explainability (Grad-CAM and Mel Spectrograms), and structured biological data archiving.
  </p>

  <h2 class="sec-title">1.3 Objectives</h2>
  <ul>
    <li>To develop a web-based multimodal system for identifying bird species worldwide from photographs and sound recordings.</li>
    <li>To implement strict verification gatekeepers that reject non-bird photographs and non-avian audio recordings.</li>
    <li>To integrate Grad-CAM attention heatmaps for visual interpretability and Mel Spectrograms (1.5 kHz – 8.5 kHz) for acoustic harmonic analysis.</li>
    <li>To dynamically generate a scientifically authentic, 6-section biological profile covering taxonomy, plumage morphology, habitat, diet, breeding behaviour, and ecological novelty.</li>
    <li>To implement a hybrid persistence layer utilizing MongoDB for telemetry and SQLite for encrypted user account credentials.</li>
    <li>To enforce an authentication gate preventing unauthenticated guests from accessing identification tools or the dashboard.</li>
  </ul>

  <h2 class="sec-title">1.4 Scope</h2>
  <p>
    The scope of Drishti encompasses educational institutions, forestry departments, wildlife research centers, and citizen scientists. The application provides secure user authentication, role management, multimodal inference, Grad-CAM overlays, Mel Spectrogram generation, and persistent history tracking. The modular architecture readily accommodates future enhancements including edge-AI mobile deployment, IoT bioacoustic sensor arrays, and GIS migration mapping.
  </p>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- PAGE 7: CHAPTER 2 - PROPOSED SYSTEM -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="page">
  <h1 class="chap-num">Chapter 2</h1>
  <h1 class="chap-title">Proposed System</h1>

  <p>
    The proposed <b>Drishti</b> system provides a modern, cloud-connected, web-based solution for multimodal avian species recognition. Unlike legacy tools that depend on static catalogues and manual identification, the proposed system offers a secure, reactive platform where authenticated naturalists can upload visual or acoustic samples and receive verified species profiles.
  </p>
  <p>
    The application frontend is built using <b>React 18</b> and <b>Tailwind CSS</b>, delivering a responsive, minimalist, green-themed user experience. The backend services and deep learning pipelines are implemented using <b>Python</b> and <b>FastAPI</b>. <b>MongoDB</b> serves as the primary database for polymorphic identification documents, Grad-CAM overlays, Mel spectrograms, and aggregate statistics, while <b>SQLite</b> manages encrypted user accounts. <b>Librosa</b> processes audio frequencies to compute Mel Spectrograms, while <b>Grad-CAM</b> highlights convolutional attention heatmaps over specimen images.
  </p>
  <p>
    To ensure scientific rigor, the proposed system employs two distinct identification pipelines:
  </p>
  <ol>
    <li><b>Image-Based Identification Pipeline:</b> Photographs undergo file integrity and blur validation. A neural gatekeeper verifies avian morphology. Confirmed birds are classified via Google Gemini Vision backed by MobileNetV2, Grad-CAM heatmaps are rendered, and a 6-section biological profile is compiled. Non-bird imagery is rejected with: <i>"No bird detected. Please upload a valid bird image."</i></li>
    <li><b>Audio-Based Bioacoustic Pipeline:</b> Audio recordings undergo duration, format, and silence checks. Bandpass filtering inspects avian frequency ranges (1.5 kHz – 8.5 kHz). Confirmed bird vocalizations are classified, an interactive Mel Spectrogram is rendered, and audio playback is enabled. Non-bird recordings are rejected with: <i>"No recognizable bird sound detected. Please upload a valid bird recording."</i></li>
  </ol>
  <p>
    A strict authentication gate ensures that unauthenticated guests must sign in or register before accessing the dashboard or identification services, preventing unauthorized resource consumption and maintaining personal observation archives.
  </p>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- PAGE 8: CHAPTER 3 - REQUIREMENTS SPECIFICATION -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="page">
  <h1 class="chap-num">Chapter 3</h1>
  <h1 class="chap-title">Requirements Specification</h1>

  <h2 class="sec-title">3.1 Hardware Requirements</h2>
  <p>
    To develop, deploy, and execute the Drishti system efficiently with concurrent deep learning inference and bioacoustic transformations, the minimum hardware specifications are listed in Table 3.1.
  </p>

  <p class="table-caption">Table 3.1: Hardware Requirements</p>
  <table class="data-table">
    <tr>
      <th style="width: 30%;">Component</th>
      <th>Specification</th>
    </tr>
    <tr>
      <td><b>Processor</b></td>
      <td>Intel Core i5 / AMD Ryzen 5 (2.5 GHz or higher).</td>
    </tr>
    <tr>
      <td><b>RAM</b></td>
      <td>8 GB minimum (16 GB recommended for concurrent deep learning tasks).</td>
    </tr>
    <tr>
      <td><b>Storage</b></td>
      <td>256 GB SSD/HDD (Minimum 10 GB free space for uploads and models).</td>
    </tr>
    <tr>
      <td><b>Network</b></td>
      <td>Stable broadband connection for AI API queries and telemetry updates.</td>
    </tr>
    <tr>
      <td><b>Microphone / Audio</b></td>
      <td>Standard audio capture hardware or field recording device.</td>
    </tr>
  </table>

  <h2 class="sec-title">3.2 Software Requirements</h2>
  <p>
    The Drishti system is developed using modern web frameworks, Python deep learning runtimes, and open-source software components listed in Table 3.2.
  </p>

  <p class="table-caption">Table 3.2: Software Requirements</p>
  <table class="data-table">
    <tr>
      <th style="width: 30%;">Component</th>
      <th>Specification</th>
    </tr>
    <tr>
      <td><b>Operating System</b></td>
      <td>Windows 10/11, Ubuntu Linux 20.04+, or macOS.</td>
    </tr>
    <tr>
      <td><b>Programming Languages</b></td>
      <td>Python 3.10+, JavaScript (ES6+), HTML5, and CSS3.</td>
    </tr>
    <tr>
      <td><b>Frontend Framework</b></td>
      <td>React 18.x with Vite build tool, Tailwind CSS, Lucide React.</td>
    </tr>
    <tr>
      <td><b>Backend Framework</b></td>
      <td>FastAPI with Uvicorn ASGI Server.</td>
    </tr>
    <tr>
      <td><b>Deep Learning & Vision</b></td>
      <td>TensorFlow, Keras, OpenCV, Pillow, Grad-CAM.</td>
    </tr>
    <tr>
      <td><b>Audio & Bioacoustics</b></td>
      <td>Librosa, SoundFile, NumPy, SciPy (Mel Spectrogram generation).</td>
    </tr>
    <tr>
      <td><b>Databases</b></td>
      <td>MongoDB (Telemetry & Observation Docs), SQLite (Auth & History).</td>
    </tr>
    <tr>
      <td><b>AI Cloud Engine</b></td>
      <td>Google Gemini Multimodal API (Vision & Bioacoustics).</td>
    </tr>
    <tr>
      <td><b>Development Tools</b></td>
      <td>Visual Studio Code, Git, GitHub, MongoDB Compass.</td>
    </tr>
    <tr>
      <td><b>Web Browser</b></td>
      <td>Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari.</td>
    </tr>
  </table>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- PAGE 9: CHAPTER 4 - SYSTEM DESIGN -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="page">
  <h1 class="chap-num">Chapter 4</h1>
  <h1 class="chap-title">System Design</h1>

  <h2 class="sec-title">4.1 System Architecture</h2>
  <p>
    The application is structured around a scalable <b>Three-Tier Architecture</b>:
  </p>
  <ul>
    <li><b>Client Tier (Presentation):</b> Constructed using React 18, Vite, and Tailwind CSS. Manages user interactions, multimedia uploads, audio playback, client-side validation, and state-driven result rendering.</li>
    <li><b>Application Tier (Business Logic):</b> Driven by Python FastAPI. Defines RESTful endpoints, coordinates authentication, invokes the Gemini API and localized MobileNetV2 classifiers, generates Grad-CAM heatmaps, computes Mel spectrograms, and compiles biological taxonomy.</li>
    <li><b>Data Tier (Persistence):</b> A hybrid data layer combining MongoDB for polymorphic observation documents and SQLite for secure, encrypted user credential management.</li>
  </ul>

  <h2 class="sec-title">4.2 Data Flow Diagram (DFD)</h2>
  <h3 class="subsec-title">4.2.1 Level 0 Data Flow Diagram (Context Diagram)</h3>
  <p>
    Figure 4.1 illustrates the overall context diagram of Drishti, tracing interactions between the Naturalist/User, external AI engines, and backend databases.
  </p>

  <div class="diagram-box">
  +------------------+     1. Credentials / Registration      +----------------------------+
  |                  | -------------------------------------> |                            |
  |                  | <------------------------------------- |                            |
  |                  |     2. Session Token & User Profile    |                            |
  |                  |                                        |                            |
  |    Naturalist    |     3. Upload Bird Image / Audio       |            0.0             |
  |     / User       | -------------------------------------> |    Drishti Multimodal      |
  |                  |                                        |    Avian Identification    |
  |                  | <------------------------------------- |           System           |
  |                  |     4. Species Result, 6-Section Bio,  |                            |
  |                  |        Grad-CAM, Mel Spectrogram       |                            |
  +------------------+                                        +----------------------------+
                                                                  |   ^                |   ^
                                       5. Prompts / Raw Media     |   |                |   |
                                       6. JSON Taxonomy / Mel     |   |                |   |
                                                                  v   |                v   |
                                                          +---------------+    +---------------+
                                                          | Google Gemini |    |    MongoDB    |
                                                          | Multimodal AI |    |    & SQLite   |
                                                          +---------------+    +---------------+
  </div>
  <p class="caption">Figure 4.1: Level 0 Context Diagram: Drishti Multimodal Identification System</p>

  <h3 class="subsec-title">4.2.2 Level 1 Data Flow Diagram (Architectural Decomposition)</h3>
  <p>
    Figure 4.2 breaks down the system into individual functional sub-processes, tracing media ingestion, gatekeeper validation, dual inference, and data persistence.
  </p>

  <div class="diagram-box">
  [User] ---> (1.0 Auth Gate) <=======> [SQLite: users]
                   |
             (Valid Token)
                   v
  [Upload] -> (2.0 Gatekeeper Validation) ---> [Non-Avian] ---> [Rejection Log & Error]
                   |
            (Valid Avian)
          +--------+--------+
          |                 |
     [Bird Image]      [Bird Audio]
          |                 |
          v                 v
   (3.0 Vision &      (4.0 Bioacoustic &
     Grad-CAM)          Spectrogram)
          |                 |
          +--------+--------+
                   |
                   v
   (5.0 Dynamic 6-Section Synthesizer)
                   |
        +----------+----------+
        v                     v
 [Rendered Result UI]   [MongoDB: identifications]
  </div>
  <p class="caption">Figure 4.2: Level 1 Data Flow Diagram: Architectural Decomposition</p>

  <h2 class="sec-title">4.3 Database Design</h2>
  <p>
    The database architecture balances document flexibility in MongoDB with strict relational integrity in SQLite, outlined in Table 4.1.
  </p>

  <p class="table-caption">Table 4.1: Database Table and Collection Specifications</p>
  <table class="data-table">
    <tr>
      <th style="width: 25%;">Collection / Table</th>
      <th style="width: 15%;">Engine</th>
      <th>Description and Schema Attributes</th>
    </tr>
    <tr>
      <td><b>users</b></td>
      <td>SQLite</td>
      <td>Stores user authentication credentials. Attributes: <code>id</code> (PK), <code>name</code>, <code>email</code> (UNIQUE), <code>password_hash</code> (salted SHA-256), <code>created_at</code>.</td>
    </tr>
    <tr>
      <td><b>classification_history</b></td>
      <td>SQLite</td>
      <td>Local backup archive. Attributes: <code>id</code> (PK), <code>filename</code>, <code>image_url</code>, <code>predicted_species_id</code>, <code>predicted_common_name</code>, <code>predicted_scientific_name</code>, <code>confidence</code>, <code>top_predictions_json</code>, <code>created_at</code>.</td>
    </tr>
    <tr>
      <td><b>identifications</b></td>
      <td>MongoDB</td>
      <td>Primary identification telemetry. Attributes: <code>identification_id</code> (UUID), <code>input_type</code> ('image'/'audio'), <code>uploaded_filename</code>, <code>media_url</code>, <code>detection_status</code> ('success'/'rejected'), <code>predicted_species</code>, <code>scientific_name</code>, <code>confidence_score</code>, <code>top_predictions</code>, <code>annotated_url</code>, <code>spectrogram_url</code>, <code>telemetry</code>, <code>timestamp</code>.</td>
    </tr>
    <tr>
      <td><b>settings</b></td>
      <td>MongoDB</td>
      <td>System configuration. Attributes: <code>key</code>, <code>high_confidence</code> (0.75), <code>medium_confidence</code> (0.40), <code>blur_threshold</code> (15.0), <code>updated_at</code>.</td>
    </tr>
  </table>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- PAGE 10: CHAPTER 5 - IMPLEMENTATION -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="page">
  <h1 class="chap-num">Chapter 5</h1>
  <h1 class="chap-title">Implementation</h1>

  <h2 class="sec-title">5.1 Frontend Screens & UI Logic</h2>
  <p>
    The user interface is developed using React 18 and Tailwind CSS, organized into responsive modules:
  </p>
  <ul>
    <li><b>LandingPage.jsx:</b> High-definition avian landing portal featuring direct <code>SIGN IN</code> and <code>REGISTER</code> authentication controls. Guest bypasses and static species numbers have been eliminated.</li>
    <li><b>AuthPage.jsx:</b> Secure login and registration portal connected directly to the SQLite backend. Unauthenticated guest exploration has been completely removed.</li>
    <li><b>DashboardHome.jsx:</b> Streamlined dashboard featuring exactly two statistics cards (<b>AI Engine: Multimodal AI</b> and <b>Identification Modes: Image & Audio</b>), an interactive hero <b>Identify Bird</b> card with dual triggers, and a recent history viewer.</li>
    <li><b>IdentifyBird.jsx:</b> Unified multimodal workspace supporting Image and Audio ingestion, progress stage indicators, drag-and-drop file upload, and audio playback.</li>
    <li><b>StructuredBirdResult.jsx:</b> Renders the 6-section biological profile, IUCN status badge, calibrated confidence meter, Grad-CAM attention viewer, and citation standards.</li>
    <li><b>ClassificationHistory.jsx:</b> Live history explorer with dynamic category counters (All, Vision, Bioacoustics, Rejections) loaded in real time from the database.</li>
  </ul>

  <h2 class="sec-title">5.2 Backend API & Routing</h2>
  <p>
    The backend is implemented using FastAPI and Uvicorn. Express-style asynchronous routing handles file uploads, inference, authentication, and database persistence:
  </p>
  <ul>
    <li><code>POST /api/auth/register</code>: Validates inputs, salts and hashes passwords, and saves new user accounts to SQLite.</li>
    <li><code>POST /api/auth/login</code>: Authenticates credentials and issues session tokens.</li>
    <li><code>POST /api/identify/image</code>: Processes photographs, executes blur and presence validation, generates Grad-CAM overlays, and compiles biological taxonomy.</li>
    <li><code>POST /api/identify/audio</code>: Validates audio duration and silence, performs acoustic frequency detection, computes Mel Spectrograms, and compiles biological profiles.</li>
    <li><code>GET /api/history</code>: Returns paginated observation history with dynamic counts (<code>counts: {{all, image, audio, rejected}}</code>).</li>
  </ul>

  <h2 class="sec-title">5.3 Multimodal AI Vision & Bioacoustic Classification Engine</h2>
  <p>
    Visual explainability is achieved via <b>Grad-CAM</b>, calculating the gradient of species class score $Y^c$ with respect to feature activation maps $A^k$:
  </p>
  <div class="formula-box">
    &alpha;<sub>k</sub><sup>c</sup> = (1 / Z) &sum;<sub>i</sub> &sum;<sub>j</sub> (&part;Y<sup>c</sup> / &part;A<sub>i,j</sub><sup>k</sup>)<br>
    L<sub>Grad-CAM</sub><sup>c</sup> = ReLU( &sum;<sub>k</sub> &alpha;<sub>k</sub><sup>c</sup> A<sup>k</sup> )
  </div>
  <p>
    For bioacoustics, <b>Librosa</b> converts raw audio waveforms $x(t)$ into Mel-frequency spectrograms using the perceptual Mel formula:
  </p>
  <div class="formula-box">
    m = 2595 &middot; log<sub>10</sub>(1 + f / 700)
  </div>
  <p class="noindent">
    Acoustic energy within the 1.5 kHz – 8.5 kHz band confirms harmonic vocalizations and visually exposes avian chirps.
  </p>

  <h2 class="sec-title">5.4 Database Connectivity & Security</h2>
  <p>
    The hybrid persistence layer ensures zero data loss: MongoDB handles high-volume polymorphic observation documents, while SQLite provides zero-configuration local user storage. User passwords are encrypted with 16-byte random salts and hashed via SHA-256. A strict client and server authentication gate ensures that unauthenticated guests cannot access the dashboard or identification endpoints.
  </p>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- PAGE 11: CHAPTER 6 - RESULTS AND SCREENSHOTS -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="page">
  <h1 class="chap-num">Chapter 6</h1>
  <h1 class="chap-title">Results and Screenshots</h1>

  <h2 class="sec-title">6.1 Home Page & Landing Portal</h2>
  <p>
    The Home Page serves as the public entry point to Drishti, as shown in Figure 6.1. It presents the project title, multimodal identification capabilities, and navigation options for users to sign in or register. The interface displays live database telemetry in the bottom badge, while guest bypass options and static 100-species restrictions have been removed.
  </p>

  <div class="diagram-box">
  +----------------------------------------------------------------------------------------------------+
  |  (Bird Icon) Drishti                                                         [ SIGN IN ] [ REGISTER ]
  |                                                                                                    |
  |      ACTIVATE THE POWER OF DRISHTI AI                                                             |
  |      Identify Any Bird Worldwide with Neural Vision.                                               |
  |      Upload any bird photograph or vocalization to instantly discover its common name,             |
  |      scientific taxonomy, dietary niche, native habitat, and IUCN rating with deep learning.       |
  |                                                                                                    |
  |      [ (Scan Icon) IDENTIFY A BIRD NOW -> ]                                                       |
  |                                                                                                    |
  |  (Shield) 14 Database Records • Multimodal AI             [ START IDENTIFICATION ] [ EXPLORE DASHBOARD -> ]
  +----------------------------------------------------------------------------------------------------+
  </div>
  <p class="caption">Figure 6.1: Home Page and Landing Portal of Drishti</p>

  <h2 class="sec-title">6.2 Authentication Pages (Login/Registration)</h2>
  <p>
    Figure 6.2 illustrates the secure authentication module. The system validates user credentials dynamically against the database, supporting registration for new users and sign-in for existing naturalists. Guest access has been strictly disabled.
  </p>

  <div class="diagram-box">
  +----------------------------------------------------------------------------------------------------+
  |  [ <- Back to Landing ]                                                                            |
  |                                         (Bird Icon)                                                |
  |                                     Sign in to Drishti                                             |
  |                     Enter your credentials to access the identification dashboard.                 |
  |                                                                                                    |
  |                                  [  Sign In  ]   [  Register  ]                                    |
  |                          Email Address:    [ naturalist@example.com      ]                         |
  |                          Password:         [ ******************         ]                         |
  |                                         [ Sign In -> ]                                             |
  |                                  New user? Register first                                          |
  |                               (Shield) Local secure SQLite authentication                          |
  +----------------------------------------------------------------------------------------------------+
  </div>
  <p class="caption">Figure 6.2: User Login and Registration Security Pages</p>

  <h2 class="sec-title">6.3 Central Dashboard</h2>
  <p>
    The Central Dashboard acts as the primary management interface (Figure 6.3). It displays exactly two verified statistics cards (**AI Engine: Multimodal AI** and **Identification Modes: Image & Audio**), followed by the hero **Identify Bird** action card with dual options for Image and Audio workflows.
  </p>

  <div class="diagram-box">
  +----------------------------------------------------------------------------------------------------+
  |  Drishti [ Global Avian AI ]            Dashboard    Identify Bird    History             (User: Hithesh)
  +----------------------------------------------------------------------------------------------------+
  |  (Sparkles) Global Multimodal AI System                                                            |
  |  Global Avian Identification                                                                       |
  |  Multimodal artificial intelligence for visual and acoustic bird species recognition worldwide.    |
  |                                                                                                    |
  |  +---------------------------------------+   +---------------------------------------+             |
  |  | (CPU) AI Engine                       |   | (Layers) Identification Modes         |             |
  |  | Multimodal AI                         |   | Image & Audio                         |             |
  |  | Intelligent Bird Recognition          |   | Visual and Acoustic Recognition       |             |
  |  +---------------------------------------+   +---------------------------------------+             |
  |                                                                                                    |
  |  [ PRIMARY IDENTIFICATION CARD ]                                                                   |
  |  Identify Bird                                                                                     |
  |  Upload a bird image or audio recording to identify its species and explore biological details.    |
  |  +---------------------------------------+   +---------------------------------------+             |
  |  | (Scan) Identify Using Image           |   | (Volume) Identify Using Audio         |             |
  |  | Upload clear bird photographs.        |   | Upload sound recordings & songs.      |             |
  |  | [ Identify Using Image -> ]           |   | [ Identify Using Audio -> ]           |             |
  |  +---------------------------------------+   +---------------------------------------+             |
  |                                                                                                    |
  |  (History Icon) Classification History                                [ View All History -> ]      |
  +----------------------------------------------------------------------------------------------------+
  </div>
  <p class="caption">Figure 6.3: Central Avian Intelligence Dashboard</p>

  <h2 class="sec-title">6.4 Image-Based Bird Identification & Grad-CAM Analysis</h2>
  <p>
    Figure 6.4 illustrates photographic identification. The system verifies avian morphology, identifies the species, renders Grad-CAM attention heatmaps, and outputs calibrated confidence metrics.
  </p>

  <div class="diagram-box">
  +----------------------------------------------------------------------------------------------------+
  |  [ Image Upload Tab ]   [ Audio Upload Tab ]                                                       |
  |  +-----------------------------------+    Prediction: Indian Peafowl                               |
  |  |      [ Uploaded Specimen ]        |    Scientific Name: Pavo cristatus                          |
  |  +-----------------------------------+    Confidence: 99.0% [==========================] High      |
  |  +-----------------------------------+    Status: Least Concern (LC)                               |
  |  |     [ Grad-CAM Heatmap ]          |    Attention Analysis:                                      |
  |  +-----------------------------------+    Heatmap isolates iridescent plumage train and crest.     |
  +----------------------------------------------------------------------------------------------------+
  </div>
  <p class="caption">Figure 6.4: Image-Based Identification with Grad-CAM Attention Heatmap</p>

  <h2 class="sec-title">6.5 Audio-Based Bioacoustic Identification & Mel Spectrogram</h2>
  <p>
    Figure 6.5 demonstrates bioacoustic identification. Audio recordings are transformed into Mel Spectrograms, harmonic vocalization patterns are verified, and an audio player is provided.
  </p>

  <div class="diagram-box">
  +----------------------------------------------------------------------------------------------------+
  |  [ Image Upload Tab ]   [ Audio Upload Tab ]                                                       |
  |  +-----------------------------------+    Prediction: Asian Koel                                   |
  |  |    [ Mel Spectrogram 1.5-8.5kHz ] |    Scientific Name: Eudynamys scolopaceus                   |
  |  +-----------------------------------+    Confidence: 95.0% [========================  ] High      |
  |  [ Play Audio (00:14) > ]                 Acoustic Features: Rising fluty 'ku-oo' territorial call.|
  +----------------------------------------------------------------------------------------------------+
  </div>
  <p class="caption">Figure 6.5: Audio-Based Bioacoustic Identification & Mel Spectrogram</p>

  <h2 class="sec-title">6.6 Structured 6-Section Avian Biological Profile & History Log</h2>
  <p>
    Figure 6.6 shows the comprehensive 6-section biological profile (Sections A–F) and dynamic history filters.
  </p>

  <div class="diagram-box">
  +----------------------------------------------------------------------------------------------------+
  |  SECTION A: Basic Identification | Pavo cristatus (Phasianidae, Galliformes, Least Concern)        |
  |  SECTION B: Physical Features    | Elongated iridescent covert train; cryptic peahen plumage.      |
  |  SECTION C: Habitat & Range      | Indian Subcontinent; dry deciduous canopies, riparian scrub.    |
  |  SECTION D: Feeding Habits       | Omnivorous foraging: seeds, grain, insects, reptiles, berries.  |
  |  SECTION E: Behaviour & Breeding | Diurnal ground forager, lek courtship mating, tree roosting.    |
  |  SECTION F: Ecological Novelty   | Seed dispersal; cited from IUCN Red List & Cornell eBird.       |
  |  ------------------------------------------------------------------------------------------------- |
  |  FILTER TABS: [ All (14) ]  [ Vision (Images) (10) ]  [ Bioacoustics (3) ]  [ Rejections (1) ]     |
  +----------------------------------------------------------------------------------------------------+
  </div>
  <p class="caption">Figure 6.6: Multimodal History Log and 6-Section Biological Profile</p>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- PAGE 12: CHAPTER 7 - CONCLUSION & CHAPTER 8 - FUTURE ENHANCEMENTS -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="page">
  <h1 class="chap-num">Chapter 7</h1>
  <h1 class="chap-title">Conclusion</h1>

  <p>
    The development and deployment of the <b>Drishti – AI-Based Multimodal Bird Species Identification System</b> was successfully completed, fulfilling its primary objective of modernizing, automating, and globalizing avian species recognition. The system provides an end-to-end web platform capable of analyzing photographic imagery and bioacoustic recordings with high scientific accuracy.
  </p>
  <p>
    By integrating <b>React 18</b>, <b>Tailwind CSS</b>, <b>FastAPI</b>, <b>MongoDB</b>, and <b>SQLite</b>, the application delivers a scalable, low-latency solution for modern biodiversity conservation. The deployment of <b>Grad-CAM</b> heatmaps resolves the black-box nature of deep neural networks, while <b>Librosa</b> Mel Spectrograms provide acoustic clarity for field biologists. The implementation of strict verification gatekeepers prevents false identifications on non-bird uploads, and the authentication gate secures the application against unauthenticated guest access. Drishti stands as a reliable, scalable, and scientifically grounded tool for modern ornithology and environmental informatics.
  </p>

  <br><br>
  <h1 class="chap-num">Chapter 8</h1>
  <h1 class="chap-title">Future Enhancements</h1>

  <h2 class="sec-title">8.1 Future Enhancements</h2>
  <p>
    Although the Drishti system successfully provides comprehensive multimodal avian identification, several opportunities exist for future enhancement:
  </p>
  <ul>
    <li><b>Dedicated Mobile Applications:</b> Develop native Android and iOS mobile applications with offline TensorFlow Lite models for field researchers in remote forests without network connectivity.</li>
    <li><b>Autonomous IoT Bioacoustic Monitoring:</b> Deploy solar-powered field microphone arrays running Drishti's acoustic detection pipeline for 24/7 autonomous sanctuary surveillance.</li>
    <li><b>GIS Migration Flyway Mapping:</b> Integrate OpenStreetMap and Leaflet tracking to visualize temporal bird migration routes and correlate climate shifts with species displacement.</li>
    <li><b>Automated Video Stream Tracking:</b> Extend neural vision to live video feeds, enabling automated PTZ cameras to detect and classify birds in active flight.</li>
  </ul>
</div>

</body>
</html>
"""

with open(HTML_FILE, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML generated at: {HTML_FILE}")

# Use Chrome or Edge to compile to PDF
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(chrome_path):
    chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

cmd = [
    chrome_path,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={OUTPUT_PDF}",
    HTML_FILE
]

print("Compiling PDF with:", " ".join(cmd))
res = subprocess.run(cmd, capture_output=True, text=True)
print("Exit code:", res.returncode)

if os.path.exists(OUTPUT_PDF):
    size_kb = os.path.getsize(OUTPUT_PDF) // 1024
    print(f"SUCCESS: PDF created at: {OUTPUT_PDF} ({size_kb} KB)")
else:
    print("PDF generation failed. Stderr:", res.stderr)


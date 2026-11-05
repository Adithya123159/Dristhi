   # AvianAI — Bird Species Classification & Information System

An AI-driven ecological intelligence web application engineered for automated classification and biological profiling of 100 Indian bird species. The system combines a transfer-learned **MobileNetV2** deep convolutional neural network with a **React 18 + Vite + Tailwind CSS** frontend and an asynchronous **FastAPI** backend.

---

## 🌟 Key Features

### 🦅 1. Deep Learning Bird Identification
- **Drag-and-Drop / File Picker:** Supports `.jpg`, `.jpeg`, and `.png` images with instant image preview.
- **Real-Time MobileNetV2 Inference:** Pre-trained on ImageNet and fine-tuned for 100 Indian bird species with sub-100ms latency.
- **Confidence Calibration:** Visual confidence meter flagging high, moderate, or uncertain prediction tiers.
- **Top 3 Candidate Probabilities:** Visualized as an interactive probability distribution bar chart using **Recharts**.
- **1-Click Test Birds:** Built-in sample bird images to test without uploading your own.

### 📚 2. 100 Supported Species Explorer
- Comprehensive catalog covering **all 100 Indian bird species** in the classification domain.
- Search species by common name, scientific name, or taxonomic family.
- Alphabetical **A–Z filter pills** and **IUCN Conservation Status filter** (Least Concern, Vulnerable, Endangered, Critically Endangered).
- Switchable **Grid** and **List** layout views.
- Interactive **Species Detail Modal** with full biological taxonomy, diet, habitat, and morphological characteristics.

### 📖 3. Avian Encyclopedia
- Rich reading repository detailing habitats, dietary niches, physical traits, and geographical distributions across 46 taxonomic families.

### 🕒 4. Persistent Classification History
- SQLite-backed history tracking all user uploads and neural predictions with exact timestamps and confidence ratings.
- Download complete classification history in structured **JSON format**.
- Delete individual records or clear logs with confirmation.

### ⚙️ 5. Settings & Diagnostics
- Configurable backend API base URL with real-time ping latency check.
- Customizable low-confidence warning threshold.
- Live backend telemetry (TensorFlow version, model architecture, species count).

---

## 🏗️ Architecture & Technology Stack

```
[ User Browser ]
       │
       ▼
[ React 18 + Vite Frontend (Port 5173) ]
  ├── Tailwind CSS (Nature-inspired Emerald / Forest Palette)
  ├── Lucide React Icons
  └── Recharts (Probability Distribution Charts)
       │  HTTP / REST (JSON & Multipart)
       ▼
[ FastAPI Backend (Port 8000) ]
  ├── SQLite History Database (history.db)
  ├── Image Uploads & Validation
  └── TensorFlow / Keras 2.21
       └── MobileNetV2 Neural Classifier (best_model.h5)
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Python 3.10+** (Python 3.12 recommended)
- **Node.js 18+** & **npm**

---

### Step 1: Backend Setup & Execution

1. Open a terminal in the project root directory `d:\Dristhi`.
2. Activate or create the virtual environment:
   ```powershell
   # If not already created
   python -m venv --system-site-packages .venv
   .\.venv\Scripts\Activate.ps1
   ```
3. Install backend dependencies (if needed):
   ```bash
   pip install -r requirements.txt fastapi uvicorn python-multipart
   ```
4. Start the FastAPI backend server:
   ```bash
   python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   - **Backend API:** `http://localhost:8000`
   - **Interactive Swagger Docs:** `http://localhost:8000/docs`

---

### Step 2: Frontend Setup & Execution

1. Open a new terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm packages (first time only):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev -- --host 0.0.0.0 --port 5173
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health, loaded model status, species count |
| `POST` | `/api/predict` | Multipart image upload for MobileNetV2 classification |
| `GET` | `/api/species` | Search and filter 100 supported bird species |
| `GET` | `/api/species/{id}` | Detailed biological profile for a single species |
| `GET` | `/api/history` | Retrieve logged predictions from SQLite |
| `DELETE` | `/api/history/{id}` | Delete a specific prediction log |
| `DELETE` | `/api/history` | Clear all classification logs |
| `GET` | `/api/stats` | Aggregated dashboard telemetry metrics |
| `GET` | `/api/sample-images`| Sample images for 1-click test identification |

---

## 🧠 Machine Learning Model Details

- **Backbone:** MobileNetV2 (ImageNet weights, inverted residual blocks with depthwise separable convolutions)
- **Input Dimension:** `224 × 224 × 3` normalized to `[-1, 1]`
- **Regularization:** GlobalAveragePooling2D + Dropout (`rate = 0.2`)
- **Classification Head:** Dense Softmax layer over 100 Indian bird species
- **Inference Latency:** ~40ms - 80ms on CPU

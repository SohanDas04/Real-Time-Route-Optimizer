# 🗺️ Real-Time Route Optimizer

A full-stack application that computes optimized routes in real time using live traffic data, a machine learning model, and the OSRM (Open Source Routing Machine) engine.

---

## 📁 Project Structure

```
Real-Time-Route-Optimizer/
├── backend/          # Python API server + ML model
├── frontend/         # Node.js / React frontend
├── osrm-data/        # OSRM map data (not committed — see setup)
└── .gitignore
```

---

## ✨ Features

- **Real-time route optimization** powered by the OSRM routing engine
- **Machine learning traffic prediction** using a trained XGBoost model (`traffic_model.ubj`) on historical traffic data (`traffic_data.csv`)
- **Interactive frontend** for entering start/end points and visualizing optimized routes
- **REST API** backend exposing route and traffic endpoints
- **Environment-based configuration** for easy local and production setup

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Backend   | Python, FastAPI / Flask           |
| ML Model  | XGBoost (`.ubj` model format)     |
| Routing   | OSRM (Open Source Routing Machine)|
| Frontend  | Node.js, React, Vite              |
| Data      | CSV traffic dataset               |

---

## ⚙️ Prerequisites

- Python 3.9+
- Node.js 18+
- OSRM installed and map data prepared (see [OSRM docs](http://project-osrm.org/))

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SohanDas04/Real-Time-Route-Optimizer.git
cd Real-Time-Route-Optimizer
```

---

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file and add required environment variables
cp .env.example .env
# Edit .env with your configuration
```

#### Backend Environment Variables (`backend/.env`)

```env
PORT=8000
OSRM_URL=http://localhost:5000   # URL of your running OSRM instance
```

#### Start the backend server

```bash
python main.py
```

The API will be available at `http://localhost:8000`.

---

### 3. OSRM Setup

OSRM requires pre-processed map data. Download a region file from [Geofabrik](https://download.geofabrik.de/) and follow the [OSRM backend quickstart](https://github.com/Project-OSRM/osrm-backend#quick-start) to prepare and serve it:

```bash
# Example using Docker
docker run -t -v "${PWD}/osrm-data:/data" ghcr.io/project-osrm/osrm-backend \
  osrm-extract -p /opt/car.lua /data/region.osm.pbf

docker run -t -v "${PWD}/osrm-data:/data" ghcr.io/project-osrm/osrm-backend \
  osrm-partition /data/region.osrm

docker run -t -v "${PWD}/osrm-data:/data" ghcr.io/project-osrm/osrm-backend \
  osrm-customize /data/region.osrm

docker run -t -p 5000:5000 -v "${PWD}/osrm-data:/data" ghcr.io/project-osrm/osrm-backend \
  osrm-routed --algorithm mld /data/region.osrm
```

> ⚠️ OSRM map data files are large and are excluded from this repository via `.gitignore`.

---

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create a .env file
cp .env.example .env
# Edit .env with your configuration (e.g., backend API URL)
```

#### Frontend Environment Variables (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000
```

#### Start the frontend dev server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🧠 ML Model

The backend uses a pre-trained **XGBoost** model (`traffic_model.ubj`) trained on `traffic_data.csv` to predict traffic conditions and factor them into route scoring. The model and dataset are excluded from the repository and must be generated or provided separately.

To retrain the model, run:

```bash
cd backend
python train_model.py   # adjust filename if different
```

---

## 📡 API Overview

| Method | Endpoint          | Description                        |
|--------|-------------------|------------------------------------|
| GET    | `/health`         | Health check                       |
| POST   | `/optimize-route` | Returns optimized route for input  |
| GET    | `/traffic`        | Returns current traffic predictions|

> Full API documentation is available at `http://localhost:8000/docs` when the server is running.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source. See [LICENSE](LICENSE) for details.

---

## 👤 Author

**Sohan Das** — [@SohanDas04](https://github.com/SohanDas04)
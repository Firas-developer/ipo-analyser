# IPO Assistant

A comprehensive web application for analyzing Initial Public Offerings (IPOs) with financial metrics, scoring system, and data visualization.

## 🚀 Features

- **IPO Analysis**: Analyze IPOs based on financial metrics, valuation comfort, and market demand
- **Financial Scoring**: Multi-dimensional scoring system including financial strength, valuation comfort, promoter quality, and demand strength
- **Data Visualization**: Interactive charts and graphs for financial data presentation
- **PDF Processing**: Extract and analyze financial data from IPO documents
- **RESTful API**: FastAPI backend with comprehensive endpoints
- **Modern UI**: React frontend with TailwindCSS and responsive design

## 📋 Tech Stack

### Frontend
- **React 18** - Modern JavaScript framework
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API requests
- **Chart.js/Recharts** - Data visualization

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation and settings management
- **PDFPlumber** - PDF text extraction
- **Google GenAI** - AI integration for analysis
- **Uvicorn** - ASGI server

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.9 or higher)
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On Unix/MacOS
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 🌐 Deployment

### Vercel Deployment

#### Frontend
The frontend is configured for Vercel deployment with `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [{"source": "/(.*)", "destination": "/index.html"}]
}
```

#### Backend
The backend FastAPI application is configured for Vercel with `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "app/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app/main.py"
    }
  ],
  "env": {
    "PYTHON_VERSION": "3.9"
  }
}
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
# API Keys
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Application Settings
APP_NAME=IPO Assistant
DEBUG=true

# CORS Settings
BACKEND_CORS_ORIGINS=["http://localhost:5173", "https://your-frontend-domain.vercel.app"]
```

## 📊 API Endpoints

### IPO Analysis
- `POST /api/v1/ipo/analyze` - Analyze IPO with given metrics
- `GET /api/v1/ipo/scores/{ipo_id}` - Get IPO scores
- `GET /api/v1/ipo/financials/{ipo_id}` - Get financial data

### Data Models

#### IPOAnalysisRequest
```python
{
  "issue_price": 100.0,
  "gmp": 0.0,
  "sub_retail": 0.0,
  "sub_nii": 0.0,
  "sub_qib": 0.0
}
```

#### IPOScores
```python
{
  "financial_strength": 85,
  "valuation_comfort": 75,
  "promoter_quality": 90,
  "demand_strength": 80
}
```

## 🎯 Usage

1. **Start the Development Servers**
   - Frontend: `npm run dev` (runs on http://localhost:5173)
   - Backend: `uvicorn app.main:app --reload` (runs on http://localhost:8000)

2. **Access API Documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

3. **Analyze IPOs**
   - Enter IPO details in the frontend form
   - View comprehensive analysis and scores
   - Explore financial charts and metrics

## 📁 Project Structure

```
IPO-Assistant/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── ipo_routes.py
│   │   ├── core/
│   │   │   └── config.py
│   │   ├── models/
│   │   │   └── ipo.py
│   │   ├── services/
│   │   │   └── ipo_analyzer.py
│   │   └── main.py
│   ├── requirements.txt
│   ├── .env
│   ├── .gitignore
│   └── vercel.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   ├── .gitignore
│   └── vercel.json
└── README.md
```

## 🔧 Development

### Adding New Features
1. Backend: Add new routes in `app/api/v1/`
2. Frontend: Create components in `src/components/`
3. Models: Define data structures in `app/models/`
4. Services: Implement business logic in `app/services/`

### Code Style
- Backend: Follow PEP 8 guidelines
- Frontend: Use ESLint configuration
- Commits: Use conventional commit messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation at `/docs`
- Review the project structure and code comments

## 🚀 Future Enhancements

- [ ] Real-time IPO data integration
- [ ] Advanced AI-powered predictions
- [ ] Mobile application
- [ ] Historical IPO performance tracking
- [ ] User authentication and profiles
- [ ] Portfolio management features

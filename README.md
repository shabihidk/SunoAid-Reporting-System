# 🏛️ SunoAid - Civic Reporting System

A modern, full-stack civic issue reporting platform built with React, Flask, and PostgreSQL. SunoAid empowers citizens to report civic issues and helps local governments manage community concerns efficiently.

![SunoAid Platform](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/Frontend-React%2018-blue)
![Flask](https://img.shields.io/badge/Backend-Flask-lightgrey)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

## ✨ Features

### 🎯 **Citizen Features**
- **Issue Reporting**: Submit detailed civic issues with photos and location data
- **Real-time Tracking**: Monitor the status of reported issues
- **Interactive Dashboard**: View all community issues with filtering and search
- **Social Engagement**: Vote and comment on issues
- **Profile Management**: Manage personal reporting history

### 🏛️ **Government Features**  
- **Issue Management**: Track, assign, and resolve reported issues
- // **Department Coordination**: Route issues to appropriate departments
- // **Analytics Dashboard**: Monitor trends and response times
- **Citizen Communication**: Update citizens on issue progress

### 🎨 **Technical Features**
- **UI**: Modern, clean design with smooth animations
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Real-time Updates**: Live status updates and notifications
- **Media Upload**: Support for multiple image uploads
- // **Geolocation**: Automatic location detection and mapping
- // **Filtering**: Search and filter by category, status, location
- **Secure Authentication**: JWT-based user authentication

## 🚀 Quick Start

### 🎯 **Option 1: Automated Setup (Recommended)**

Simply run the automated launcher - it handles everything for you!

**Windows:**
```cmd
python run_sunoaid.py
# OR double-click: start_sunoaid.bat
```

**Linux/Mac:**
```bash
python3 run_sunoaid.py
# OR: ./start_sunoaid.sh
```

The automated launcher will:
- ✅ Check all prerequisites 
- ✅ Set up virtual environment
- ✅ Install all dependencies
- ✅ Start both frontend and backend
- ✅ Open the application automatically

### 🛠️ **Option 2: Manual Setup**

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/SunoAid---Reporting-System.git
   cd SunoAid---Reporting-System
   ```

2. **Set up environment**:
   ```bash
   # Copy environment template
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Install dependencies**:
   ```bash
   # Backend dependencies
   pip install -r requirements.txt
   
   # Frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

4. **Setup database**:
   ```bash
   # Create PostgreSQL database
   createdb sunoaid_db
   
   # Run database schema
   psql -d sunoaid_db -f database_schema.sql
   ```

5. **Start the application**:
   ```bash
   # Terminal 1: Start backend
   python app.py
   
   # Terminal 2: Start frontend
   cd frontend
   npm run dev
   ```

6. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

### 🎮 **Launcher Options**

The automated launcher supports several options:

```bash
# Setup only (don't start servers)
python run_sunoaid.py --setup-only

# Start backend only
python run_sunoaid.py --no-frontend

# Start frontend only  
python run_sunoaid.py --no-backend

# Full help
python run_sunoaid.py --help
```

## 📖 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Complete setup instructions
- **[Database Schema](database_schema.sql)** - Database structure
- **[CORS Setup](cors_setup_example.py)** - Cross-origin configuration reference

## 🏗️ Architecture

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Main application pages
│   ├── contexts/      # React contexts (Auth, etc.)
│   └── assets/        # Static assets
```

### Backend (Flask)
```
├── app.py             # Main Flask application
├── models/            # Database models
├── routes/            # API route handlers
├── static/            # Static file serving
└── utils/             # Utility functions
```

### Database (PostgreSQL)
- **Users**: Citizen and government user accounts
- **Issues**: Reported civic issues with metadata
- **Categories**: Issue categorization system
- **Locations**: Hierarchical location management
- **Comments & Votes**: Social engagement features

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 18, TypeScript, Vite | Modern UI framework with fast development |
| **Styling** | Tailwind CSS, Framer Motion | Utility-first CSS with smooth animations |
| **Backend** | Flask, Python | Lightweight and flexible web framework |
| **Database** | PostgreSQL | Reliable relational database |
| **Authentication** | Flask Sessions | Secure user authentication |
| **File Upload** | Flask + Local Storage | Media file handling |
| **API** | RESTful API | Clean, standardized API design |

## 🌟 Key Features Breakdown

### Issue Reporting Workflow
1. **Create Issue** → 2. **Upload Media** → 3. **Set Location** → 4. **Submit**
5. **Government Review** → 6. **Assignment** → 7. **Resolution** → 8. **Closure**

### User Types & Permissions
- **Citizens**: Report issues, vote, comment, track submissions
- **Government Workers**: Manage issues, update status, communicate
- **Administrators**: Full system access, user management, analytics

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Database
DATABASE_URL=postgresql://username:password@localhost/sunoaid_db

# Flask Configuration  
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# File Upload
MAX_CONTENT_LENGTH=16777216  # 16MB
UPLOAD_FOLDER=static/uploads
```

### CORS Configuration
The application includes CORS setup for cross-origin requests between frontend (port 5173) and backend (port 5000).

## 🚦 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | System health check |
| `/api/auth/login` | POST | User authentication |
| `/api/auth/register` | POST | User registration |
| `/api/issues` | GET, POST | Issue management |
| `/api/issues/categories` | GET | Get issue categories |
| `/api/locations` | GET | Get locations |
| `/api/upload` | POST | File upload |

## 📱 Screenshots

*Add screenshots of your application here*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.




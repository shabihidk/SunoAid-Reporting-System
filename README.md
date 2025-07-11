# SunoAid - Issue Reporting System

A simple, minimal full-stack issue reporting application with location tracking.

## 🚀 Features

- **User Authentication**: Register, login, logout
- **Issue Reporting**: Create issues with detailed descriptions
- **Location Tracking**: Interactive maps with location picker
- **Dashboard**: View all reported issues
- **Real-time Data**: PostgreSQL database with live updates

## 🛠️ Tech Stack

### Backend
- **Flask** - Python web framework
- **PostgreSQL** - Database
- **Flask-SQLAlchemy** - ORM
- **Flask-CORS** - Cross-origin requests

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Leaflet** - Interactive maps
- **React Router** - Navigation

## 📦 Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd SunoAid/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials:
   ```
   DATABASE_URL=postgresql://username:password@localhost/your_database
   SECRET_KEY=your-secret-key-here
   ```

5. **Create database**
   ```bash
   createdb your_database_name  # PostgreSQL command
   ```

6. **Run the backend**
   ```bash
   python app.py
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 🌐 Usage

1. Open `http://localhost:5173` in your browser
2. Register a new account or login
3. Navigate to "Report Issue" to create a new issue
4. Use the map to select a location
5. View all issues on the Dashboard

## 🔒 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@localhost/database_name
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 📝 API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user
- `GET /api/issues` - Get all issues
- `POST /api/issues` - Create new issue

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

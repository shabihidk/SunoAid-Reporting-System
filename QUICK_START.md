# 🚀 SunoAid Quick Start Guide

## Overview

This guide will help you get the SunoAid Civic Reporting System up and running in minutes.

## Prerequisites

- **Python 3.8+** installed
- **Node.js 16+** installed  
- **PostgreSQL 12+** installed and running
- **Git** (if cloning from repository)

## Quick Start (Automated)

1. **Clone or navigate to the project directory**:
   ```powershell
   cd "d:\SunoAid---Reporting-System"
   ```

2. **Run the quick start script**:
   ```powershell
   python start.py
   ```

3. **Choose option 1** for full automated setup

The script will:
- ✅ Install all Python dependencies
- ✅ Install all frontend dependencies  
- ✅ Create `.env` configuration file
- ✅ Check database connection
- ✅ Start both backend and frontend servers

## Manual Setup

If you prefer manual setup or the automated script fails:

### Step 1: Install Dependencies

```powershell
# Install Python packages
pip install -r requirements.txt

# Install frontend packages
cd frontend
npm install
cd ..
```

### Step 2: Configure Environment

```powershell
# Copy environment template
copy .env.example .env

# Edit .env file with your database credentials
# Minimum required: DATABASE_URL and SECRET_KEY
```

### Step 3: Setup Database

```powershell
# Run database setup script
python setup_database.py
```

### Step 4: Start Servers

**Terminal 1 - Backend:**
```powershell
python app.py
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/health
- **Admin Login**: admin@sunoaid.gov.ph / admin123
- **Test Login**: test@example.com / test123

## 🔧 Configuration

### Database Configuration

Edit `.env` file:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/sunoaid_db
SECRET_KEY=your-very-long-random-secret-key
```

### Frontend Configuration

The frontend automatically connects to `http://localhost:5000/api` for the backend.

## 📁 Project Structure

```
SunoAid---Reporting-System/
├── backend/                 # Backend initialization
├── models/                  # Database models
├── routes/                  # API routes
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/          # React pages
│   │   ├── components/     # React components
│   │   └── contexts/       # React contexts
├── static/                 # Static assets
├── app.py                  # Flask application
├── requirements.txt        # Python dependencies
├── setup_database.py       # Database setup script
├── start.py               # Quick start script
├── .env.example           # Environment template
└── README.md              # Project documentation
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```
   Solution: Check PostgreSQL is running and credentials in .env are correct
   Run: python setup_database.py
   ```

2. **Port Already in Use**
   ```
   Backend (5000): Kill process using port 5000
   Frontend (5173): Kill process using port 5173
   ```

3. **Module Not Found Errors**
   ```
   Solution: Install dependencies
   Run: pip install -r requirements.txt
   ```

4. **Frontend Build Errors**
   ```
   Solution: Install frontend dependencies
   Run: cd frontend && npm install
   ```

### Database Issues

If database setup fails:

1. **Check PostgreSQL is running**:
   ```powershell
   # Check if PostgreSQL service is running
   Get-Service postgresql*
   ```

2. **Check connection manually**:
   ```python
   import psycopg2
   conn = psycopg2.connect("postgresql://username:password@localhost:5432/postgres")
   print("Connected!")
   ```

3. **Reset database**:
   ```powershell
   # Drop and recreate database
   python setup_database.py
   ```

## 🔒 Security Notes

- Change default passwords immediately
- Use strong secret keys in production
- Enable SSL in production
- Keep dependencies updated

## 🎯 Next Steps

After successful setup:

1. **Test the application**:
   - Register a new user account
   - Create a sample issue report
   - Test voting and commenting features

2. **Customize for your location**:
   - Update location data in database
   - Add relevant departments
   - Customize categories

3. **Deploy to production**:
   - Use production database
   - Configure proper environment variables
   - Set up SSL certificates
   - Use production WSGI server

## 📞 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review log files for error messages
3. Ensure all prerequisites are met
4. Try the automated setup script

---

**Happy coding! 🎉**

The SunoAid team

# SunoAid - Civic Reporting System

A platform for reporting and managing civic issues. Built with React (frontend), Flask (backend), and PostgreSQL (database).

---

## Features
- Citizens can report issues, upload photos, and set locations
- Dashboard to view, filter, and search issues
- Voting and comments on issues
- Profile management
- Government dashboard for managing and resolving issues

---

## How to Run Everything (Step by Step)

### 1. Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- (Optional) Git

### 2. Clone the Repo
```bash
git clone https://github.com/your-username/SunoAid---Reporting-System.git
cd SunoAid---Reporting-System
```

### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 4. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 5. Set Up the Database
- Make sure PostgreSQL is running.
- Edit `setup_database.py` if you want to change DB credentials (defaults: user=postgres, password=qwerty12345, db=sunoaid).
- Run the setup script:
```bash
python setup_database.py
```
- This will create the database (if it doesn't exist) and apply the schema from `database_schema.sql`.

### 6. Start the Backend
```bash
python app.py
```
- The API will be at http://localhost:5000

### 7. Start the Frontend
```bash
cd frontend
npm run dev
```
- The app will be at http://localhost:5173

---

## Common Issues
- If you get DB errors, check your PostgreSQL is running and credentials in `setup_database.py` match your local setup.
- If you change models, update `database_schema.sql` and re-run `setup_database.py`.
- For Windows, you might need to use `python` instead of `python3`.

---

## Project Structure
```
SunoAid-Reporting-System/
├── app.py              # Flask backend
├── models/             # SQLAlchemy models
├── routes/             # API endpoints
├── static/             # Static files/uploads
├── frontend/           # React app (Vite + Tailwind)
├── database_schema.sql # DB schema
├── setup_database.py   # DB setup script
└── requirements.txt    # Python deps
```

---

## API Endpoints (Backend)
- `/api/health` - Health check
- `/api/auth/login` - Login
- `/api/auth/register` - Register
- `/api/issues` - Get/create issues
- `/api/issues/categories` - Get categories
- `/api/locations` - Get locations
- `/api/upload` - Upload files

---

## Environment Variables
- Backend config is in `app.py` and/or `.env` (if you use one)
- DB credentials are in `setup_database.py`

---

## Contributing
- Fork, branch, PR, etc. Usual GitHub flow.

---

## License
MIT

---

If you get stuck, check the code or open an issue. This is a pretty standard Flask + React + Postgres stack, nothing fancy.




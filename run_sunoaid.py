#!/usr/bin/env python3
"""
🏛️ SunoAid - Civic Reporting System
Automated Setup and Launch Script

This script automatically sets up and runs the SunoAid civic reporting platform.
It handles environment setup, dependency installation, database setup, and launches both frontend and backend.

Usage:
    python run_sunoaid.py [--setup-only] [--no-frontend] [--no-backend]

Options:
    --setup-only    Only run setup without starting the servers
    --no-frontend   Skip frontend startup
    --no-backend    Skip backend startup
"""

import os
import sys
import subprocess
import time
import threading
import signal
import argparse
from pathlib import Path

class Colors:
    """ANSI color codes for terminal output"""
    GREEN = '\033[92m'
    BLUE = '\033[94m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    END = '\033[0m'

class SunoAidLauncher:
    def __init__(self):
        self.root_dir = Path(__file__).parent
        self.frontend_dir = self.root_dir / "frontend"
        self.processes = []
        
    def print_banner(self):
        """Print SunoAid banner"""
        banner = f"""
{Colors.BLUE}{Colors.BOLD}
╔══════════════════════════════════════════════════════════════╗
║                    🏛️  SunoAid Platform                      ║
║              Civic Reporting System Launcher                ║
║                                                              ║
║  🚀 Automated Setup & Launch Script                         ║
╚══════════════════════════════════════════════════════════════╝
{Colors.END}
"""
        print(banner)
    
    def log(self, message, color=Colors.GREEN):
        """Print colored log message"""
        print(f"{color}[SunoAid] {message}{Colors.END}")
    
    def run_command(self, command, cwd=None, shell=True):
        """Run a command and return success status"""
        try:
            self.log(f"Running: {command}")
            result = subprocess.run(
                command, 
                cwd=cwd or self.root_dir, 
                shell=shell, 
                check=True,
                capture_output=True,
                text=True
            )
            return True, result.stdout
        except subprocess.CalledProcessError as e:
            self.log(f"Error running command: {e}", Colors.RED)
            if e.stderr:
                self.log(f"Error output: {e.stderr}", Colors.RED)
            return False, e.stderr
    
    def check_prerequisites(self):
        """Check if required tools are installed"""
        self.log("🔍 Checking prerequisites...")
        
        # Check Python
        python_version = sys.version_info
        if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
            self.log("❌ Python 3.8+ required", Colors.RED)
            return False
        self.log(f"✅ Python {python_version.major}.{python_version.minor} found")
        
        # Check Node.js
        success, output = self.run_command("node --version")
        if not success:
            self.log("❌ Node.js not found. Please install Node.js 16+", Colors.RED)
            return False
        self.log(f"✅ Node.js found: {output.strip()}")
        
        # Check npm
        success, output = self.run_command("npm --version")
        if not success:
            self.log("❌ npm not found", Colors.RED)
            return False
        self.log(f"✅ npm found: {output.strip()}")
        
        # Check PostgreSQL (optional warning)
        success, output = self.run_command("psql --version")
        if not success:
            self.log("⚠️  PostgreSQL not found in PATH. Make sure it's installed and accessible", Colors.YELLOW)
        else:
            self.log(f"✅ PostgreSQL found: {output.strip()}")
        
        return True
    
    def setup_environment(self):
        """Setup environment file"""
        self.log("🔧 Setting up environment...")
        
        env_example = self.root_dir / ".env.example"
        env_file = self.root_dir / ".env"
        
        if not env_file.exists() and env_example.exists():
            try:
                with open(env_example, 'r') as src, open(env_file, 'w') as dst:
                    dst.write(src.read())
                self.log("✅ Created .env file from template")
            except Exception as e:
                self.log(f"❌ Failed to create .env file: {e}", Colors.RED)
                return False
        else:
            self.log("✅ .env file already exists")
        
        return True
    
    def install_backend_dependencies(self):
        """Install Python dependencies"""
        self.log("📦 Installing backend dependencies...")
        
        # Create virtual environment if it doesn't exist
        venv_path = self.root_dir / "venv"
        if not venv_path.exists():
            self.log("Creating virtual environment...")
            success, _ = self.run_command(f"python -m venv {venv_path}")
            if not success:
                self.log("❌ Failed to create virtual environment", Colors.RED)
                return False
        
        # Activate virtual environment and install dependencies
        if os.name == 'nt':  # Windows
            pip_cmd = f"{venv_path}\\Scripts\\pip.exe"
            python_cmd = f"{venv_path}\\Scripts\\python.exe"
        else:  # Linux/Mac
            pip_cmd = f"{venv_path}/bin/pip"
            python_cmd = f"{venv_path}/bin/python"
        
        # Install requirements
        success, _ = self.run_command(f"{pip_cmd} install -r requirements.txt")
        if not success:
            self.log("❌ Failed to install Python dependencies", Colors.RED)
            return False
        
        self.log("✅ Backend dependencies installed")
        self.python_cmd = python_cmd
        return True
    
    def install_frontend_dependencies(self):
        """Install Node.js dependencies"""
        if not self.frontend_dir.exists():
            self.log("❌ Frontend directory not found", Colors.RED)
            return False
        
        self.log("📦 Installing frontend dependencies...")
        
        # Check if node_modules exists
        node_modules = self.frontend_dir / "node_modules"
        if not node_modules.exists():
            success, _ = self.run_command("npm install", cwd=self.frontend_dir)
            if not success:
                self.log("❌ Failed to install frontend dependencies", Colors.RED)
                return False
        
        self.log("✅ Frontend dependencies installed")
        return True
    
    def setup_database(self):
        """Setup database (basic check)"""
        self.log("🗄️  Database setup...")
        
        schema_file = self.root_dir / "database_schema.sql"
        if not schema_file.exists():
            self.log("⚠️  database_schema.sql not found", Colors.YELLOW)
            return True
        
        self.log("✅ Database schema file found")
        self.log("💡 Remember to run: createdb sunoaid_db && psql -d sunoaid_db -f database_schema.sql", Colors.BLUE)
        return True
    
    def start_backend(self):
        """Start the Flask backend server"""
        self.log("🚀 Starting backend server...")
        
        try:
            # Use the virtual environment Python
            backend_process = subprocess.Popen(
                [self.python_cmd, "app.py"],
                cwd=self.root_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            self.processes.append(("Backend", backend_process))
            self.log("✅ Backend server started on http://localhost:5000")
            return True
        except Exception as e:
            self.log(f"❌ Failed to start backend: {e}", Colors.RED)
            return False
    
    def start_frontend(self):
        """Start the React frontend server"""
        self.log("🎨 Starting frontend server...")
        
        try:
            frontend_process = subprocess.Popen(
                ["npm", "run", "dev"],
                cwd=self.frontend_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            self.processes.append(("Frontend", frontend_process))
            self.log("✅ Frontend server started on http://localhost:5173")
            return True
        except Exception as e:
            self.log(f"❌ Failed to start frontend: {e}", Colors.RED)
            return False
    
    def monitor_processes(self):
        """Monitor running processes"""
        self.log("👀 Monitoring processes... Press Ctrl+C to stop")
        
        try:
            while True:
                time.sleep(5)
                for name, process in self.processes:
                    if process.poll() is not None:
                        self.log(f"⚠️  {name} process stopped", Colors.YELLOW)
                        # Try to restart
                        if name == "Backend":
                            self.start_backend()
                        elif name == "Frontend":
                            self.start_frontend()
        except KeyboardInterrupt:
            self.log("🛑 Stopping all processes...")
            self.cleanup()
    
    def cleanup(self):
        """Clean up running processes"""
        for name, process in self.processes:
            if process.poll() is None:
                self.log(f"Stopping {name}...")
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
        self.processes.clear()
    
    def show_info(self):
        """Show application information"""
        info = f"""
{Colors.BOLD}🎉 SunoAid is now running!{Colors.END}

{Colors.BLUE}📍 Access Points:{Colors.END}
  • Frontend: http://localhost:5173
  • Backend API: http://localhost:5000
  • Health Check: http://localhost:5000/api/health

{Colors.YELLOW}💡 Quick Tips:{Colors.END}
  • Make sure PostgreSQL is running and database is created
  • Check .env file for configuration
  • Use Ctrl+C to stop all servers

{Colors.GREEN}🛠️  Troubleshooting:{Colors.END}
  • If ports are busy, kill existing processes
  • Check logs in terminal for errors
  • Ensure all dependencies are installed
        """
        print(info)
    
    def run(self, setup_only=False, no_frontend=False, no_backend=False):
        """Main execution method"""
        self.print_banner()
        
        # Prerequisites check
        if not self.check_prerequisites():
            sys.exit(1)
        
        # Setup phase
        if not self.setup_environment():
            sys.exit(1)
        
        if not self.install_backend_dependencies():
            sys.exit(1)
        
        if not self.install_frontend_dependencies():
            sys.exit(1)
        
        if not self.setup_database():
            sys.exit(1)
        
        if setup_only:
            self.log("✅ Setup complete! Run without --setup-only to start servers")
            return
        
        # Start servers
        servers_started = 0
        
        if not no_backend:
            if self.start_backend():
                servers_started += 1
            time.sleep(2)  # Give backend time to start
        
        if not no_frontend:
            if self.start_frontend():
                servers_started += 1
            time.sleep(2)  # Give frontend time to start
        
        if servers_started > 0:
            self.show_info()
            self.monitor_processes()
        else:
            self.log("❌ No servers started", Colors.RED)
            sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description='SunoAid Platform Launcher')
    parser.add_argument('--setup-only', action='store_true', 
                       help='Only run setup without starting servers')
    parser.add_argument('--no-frontend', action='store_true',
                       help='Skip frontend startup')
    parser.add_argument('--no-backend', action='store_true',
                       help='Skip backend startup')
    
    args = parser.parse_args()
    
    launcher = SunoAidLauncher()
    
    # Handle Ctrl+C gracefully
    def signal_handler(sig, frame):
        print("\n")
        launcher.log("Received interrupt signal, cleaning up...")
        launcher.cleanup()
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    
    try:
        launcher.run(
            setup_only=args.setup_only,
            no_frontend=args.no_frontend,
            no_backend=args.no_backend
        )
    except Exception as e:
        launcher.log(f"❌ Unexpected error: {e}", Colors.RED)
        launcher.cleanup()
        sys.exit(1)

if __name__ == "__main__":
    main()

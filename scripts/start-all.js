import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import process from 'process';

const execAsync = promisify(exec);

// Configuration
const BACKEND_PORT = 3001;
const FRONTEND_PORT = 5173;
const STARTUP_TIMEOUT = 30000; // 30 seconds

const isWindows = process.platform === 'win32';

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = 'white', prefix = '') {
  const colorCode = colors[color] || colors.white;
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colorCode}[${timestamp}]${prefix ? ` ${prefix}` : ''} ${message}${colors.reset}`);
}

function backendLog(message) {
  log(message, 'blue', '[BACKEND]');
}

function frontendLog(message) {
  log(message, 'green', '[FRONTEND]');
}

function errorLog(message) {
  log(message, 'red', '[ERROR]');
}

function infoLog(message) {
  log(message, 'cyan', '[INFO]');
}

async function checkPort(port) {
  try {
    const command = isWindows 
      ? `netstat -ano | findstr :${port}`
      : `lsof -ti:${port}`;
    
    const { stdout } = await execAsync(command);
    return stdout.trim() !== '';
  } catch (error) {
    return false;
  }
}

async function killProcessOnPort(port) {
  try {
    infoLog(`🔍 Checking port ${port}...`);
    
    if (isWindows) {
      // Windows
      const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
      if (stdout.trim()) {
        const lines = stdout.trim().split('\n');
        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && !isNaN(pid)) {
            log(`🔪 Killing process ${pid} on port ${port}`, 'yellow');
            await execAsync(`taskkill /F /PID ${pid}`);
          }
        }
      }
    } else {
      // Linux/Mac
      const { stdout } = await execAsync(`lsof -ti:${port}`);
      if (stdout.trim()) {
        const pids = stdout.trim().split('\n');
        for (const pid of pids) {
          if (pid) {
            log(`🔪 Killing process ${pid} on port ${port}`, 'yellow');
            await execAsync(`kill -9 ${pid}`);
          }
        }
      }
    }
    
    // Wait a moment for processes to be killed
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (error) {
    // It's ok if no process was found
    log(`✅ Port ${port} is free`, 'green');
  }
}

function startBackend() {
  return new Promise((resolve, reject) => {
    backendLog('Starting backend on port 3001...');
    
    const backend = spawn('npm', ['run', 'start:force'], {
      cwd: './backend',
      stdio: 'pipe',
      shell: true
    });

    let startupTimer;
    let isResolved = false;

    backend.stdout.on('data', (data) => {
      const output = data.toString();
      backendLog(output.trim());
      
      // Check if backend is ready
      if ((output.includes('running on port 3001') || 
           output.includes('DEO Backend API running') ||
           output.includes('Server running on')) && !isResolved) {
        isResolved = true;
        clearTimeout(startupTimer);
        backendLog('✅ Backend is ready!');
        resolve(backend);
      }
    });

    backend.stderr.on('data', (data) => {
      const output = data.toString();
      if (!output.includes('ExperimentalWarning')) {
        backendLog(`⚠️ ${output.trim()}`);
      }
    });

    backend.on('error', (error) => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(startupTimer);
        errorLog(`Backend startup error: ${error.message}`);
        reject(error);
      }
    });

    backend.on('exit', (code) => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(startupTimer);
        if (code !== 0) {
          errorLog(`Backend exited with code ${code}`);
          reject(new Error(`Backend process exited with code ${code}`));
        }
      }
    });

    // Timeout for backend startup
    startupTimer = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        errorLog('Backend startup timeout');
        reject(new Error('Backend startup timeout'));
      }
    }, STARTUP_TIMEOUT);
  });
}

function startFrontend() {
  return new Promise((resolve, reject) => {
    frontendLog('Starting frontend on port 5173...');
    
    const frontend = spawn('npm', ['run', 'dev:force'], {
      stdio: 'pipe',
      shell: true
    });

    let startupTimer;
    let isResolved = false;

    frontend.stdout.on('data', (data) => {
      const output = data.toString();
      frontendLog(output.trim());
      
      // Check if frontend is ready
      if ((output.includes('Local:') && output.includes('5173')) ||
          output.includes('ready in') && !isResolved) {
        isResolved = true;
        clearTimeout(startupTimer);
        frontendLog('✅ Frontend is ready!');
        resolve(frontend);
      }
    });

    frontend.stderr.on('data', (data) => {
      const output = data.toString();
      if (!output.includes('ExperimentalWarning')) {
        frontendLog(`⚠️ ${output.trim()}`);
      }
    });

    frontend.on('error', (error) => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(startupTimer);
        errorLog(`Frontend startup error: ${error.message}`);
        reject(error);
      }
    });

    frontend.on('exit', (code) => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(startupTimer);
        if (code !== 0) {
          errorLog(`Frontend exited with code ${code}`);
          reject(new Error(`Frontend process exited with code ${code}`));
        }
      }
    });

    // Timeout for frontend startup
    startupTimer = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        errorLog('Frontend startup timeout');
        reject(new Error('Frontend startup timeout'));
      }
    }, STARTUP_TIMEOUT);
  });
}

async function main() {
  log('🚀 DEO Project - Starting all services...', 'magenta');
  
  try {
    // Kill processes on ports
    await killProcessOnPort(BACKEND_PORT);
    await killProcessOnPort(FRONTEND_PORT);
    
    // Start backend first
    const backend = await startBackend();
    
    // Wait a bit before starting frontend
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Start frontend
    const frontend = await startFrontend();
    
    log('🎉 All services are running!', 'green');
    log('📝 Access the application:', 'cyan');
    log(`   Frontend: http://localhost:${FRONTEND_PORT}`, 'cyan');
    log(`   Backend:  http://localhost:${BACKEND_PORT}`, 'cyan');
    log('👋 Press Ctrl+C to stop all services', 'yellow');
    
    // Handle shutdown
    const shutdown = () => {
      log('🛑 Shutting down all services...', 'yellow');
      
      if (frontend && !frontend.killed) {
        frontend.kill();
      }
      if (backend && !backend.killed) {
        backend.kill();
      }
      
      setTimeout(() => {
        log('✅ All services stopped', 'green');
        process.exit(0);
      }, 1000);
    };
    
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    
  } catch (error) {
    errorLog(`Failed to start services: ${error.message}`);
    process.exit(1);
  }
}

main().catch((error) => {
  errorLog(`Startup error: ${error.message}`);
  process.exit(1);
}); 
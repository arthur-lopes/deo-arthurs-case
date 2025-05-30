import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import process from 'process';
import net from 'net';

const execAsync = promisify(exec);
const TARGET_PORT = 5173;

console.log('🚀 DEO Frontend Startup Script');
console.log(`📍 Target port: ${TARGET_PORT}`);

async function checkPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(false); // Port is free
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(true); // Port is in use
    });
  });
}

async function killProcessOnPort(port) {
  try {
    console.log(`🔍 Checking for processes on port ${port}...`);
    
    const command = process.platform === 'win32' 
      ? `netstat -ano | findstr :${port}`
      : `lsof -ti:${port}`;
    
    const { stdout } = await execAsync(command);
    
    if (!stdout.trim()) {
      console.log(`✅ Port ${port} is free`);
      return;
    }

    if (process.platform === 'win32') {
      // Parse Windows netstat output
      const lines = stdout.trim().split('\n');
      const pids = new Set();
      
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          const localAddress = parts[1];
          const pid = parts[4];
          
          if (localAddress.includes(`:${port}`) && pid !== '0') {
            pids.add(pid);
          }
        }
      });

      if (pids.size === 0) {
        console.log(`✅ Port ${port} is free`);
        return;
      }

      console.log(`⚠️ Found ${pids.size} process(es) on port ${port}`);
      
      // Kill each process
      for (const pid of pids) {
        try {
          console.log(`🔪 Killing process ${pid}...`);
          await execAsync(`taskkill /F /PID ${pid}`);
          console.log(`✅ Killed process ${pid}`);
        } catch (killError) {
          console.log(`❌ Failed to kill process ${pid}: ${killError.message}`);
        }
      }

    } else {
      // Unix/Linux/Mac
      const pids = stdout.trim().split('\n').filter(pid => pid);
      
      if (pids.length === 0) {
        console.log(`✅ Port ${port} is free`);
        return;
      }

      console.log(`⚠️ Found ${pids.length} process(es) on port ${port}`);
      
      for (const pid of pids) {
        try {
          console.log(`🔪 Killing process ${pid}...`);
          await execAsync(`kill -9 ${pid}`);
          console.log(`✅ Killed process ${pid}`);
        } catch (killError) {
          console.log(`❌ Failed to kill process ${pid}: ${killError.message}`);
        }
      }
    }

    // Wait a bit for processes to fully terminate
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`✅ Port ${port} should now be free`);
    
  } catch (error) {
    // No processes found on port
    console.log(`✅ Port ${port} is free`);
  }
}

async function startFrontend() {
  try {
    console.log('\n🔧 Preparing to start frontend...');
    
    // Check if target port is in use
    const portInUse = await checkPortInUse(TARGET_PORT);
    
    if (portInUse) {
      console.log(`⚠️ Port ${TARGET_PORT} is in use`);
      await killProcessOnPort(TARGET_PORT);
      
      // Double-check port is now free
      const stillInUse = await checkPortInUse(TARGET_PORT);
      if (stillInUse) {
        console.log(`❌ Failed to free port ${TARGET_PORT}. Please manually stop the process.`);
        process.exit(1);
      }
    }

    console.log(`\n🚀 Starting frontend on port ${TARGET_PORT}...`);
    
    // Start the frontend with forced port
    const frontend = spawn('npm', ['run', 'dev', '--', '--port', TARGET_PORT], {
      stdio: 'inherit',
      shell: true
    });

    frontend.on('error', (error) => {
      console.error(`❌ Failed to start frontend: ${error.message}`);
      process.exit(1);
    });

    frontend.on('close', (code) => {
      console.log(`\n🛑 Frontend process exited with code ${code}`);
      process.exit(code);
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down frontend...');
      frontend.kill('SIGINT');
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Terminating frontend...');
      frontend.kill('SIGTERM');
    });

  } catch (error) {
    console.error(`❌ Error starting frontend: ${error.message}`);
    process.exit(1);
  }
}

// Start the process
startFrontend(); 
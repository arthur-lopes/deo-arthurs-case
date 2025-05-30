const { spawn, exec } = require('child_process');
const net = require('net');

const TARGET_PORT = 3001;
const BACKEND_PORT = process.env.PORT || TARGET_PORT;

console.log('🚀 DEO Backend Startup Script');
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
  return new Promise((resolve) => {
    console.log(`🔍 Checking for processes on port ${port}...`);
    
    // Windows command to find and kill process on port
    const command = process.platform === 'win32' 
      ? `netstat -ano | findstr :${port}`
      : `lsof -ti:${port}`;
    
    exec(command, (error, stdout) => {
      if (error || !stdout.trim()) {
        console.log(`✅ Port ${port} is free`);
        resolve();
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
          resolve();
          return;
        }

        console.log(`⚠️ Found ${pids.size} process(es) on port ${port}`);
        
        // Kill each process
        const killPromises = Array.from(pids).map(pid => {
          return new Promise((killResolve) => {
            console.log(`🔪 Killing process ${pid}...`);
            exec(`taskkill /F /PID ${pid}`, (killError) => {
              if (killError) {
                console.log(`❌ Failed to kill process ${pid}: ${killError.message}`);
              } else {
                console.log(`✅ Killed process ${pid}`);
              }
              killResolve();
            });
          });
        });

        Promise.all(killPromises).then(() => {
          // Wait a bit for processes to fully terminate
          setTimeout(() => {
            console.log(`✅ Port ${port} should now be free`);
            resolve();
          }, 2000);
        });

      } else {
        // Unix/Linux/Mac
        const pids = stdout.trim().split('\n').filter(pid => pid);
        
        if (pids.length === 0) {
          console.log(`✅ Port ${port} is free`);
          resolve();
          return;
        }

        console.log(`⚠️ Found ${pids.length} process(es) on port ${port}`);
        
        pids.forEach(pid => {
          console.log(`🔪 Killing process ${pid}...`);
          exec(`kill -9 ${pid}`, (killError) => {
            if (killError) {
              console.log(`❌ Failed to kill process ${pid}: ${killError.message}`);
            } else {
              console.log(`✅ Killed process ${pid}`);
            }
          });
        });

        setTimeout(() => {
          console.log(`✅ Port ${port} should now be free`);
          resolve();
        }, 2000);
      }
    });
  });
}

async function startBackend() {
  try {
    console.log('\n🔧 Preparing to start backend...');
    
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

    console.log(`\n🚀 Starting backend on port ${TARGET_PORT}...`);
    
    // Set environment variable to ensure correct port
    process.env.PORT = TARGET_PORT;
    
    // Start the backend
    const backend = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      env: { ...process.env, PORT: TARGET_PORT },
      shell: true
    });

    backend.on('error', (error) => {
      console.error(`❌ Failed to start backend: ${error.message}`);
      process.exit(1);
    });

    backend.on('close', (code) => {
      console.log(`\n🛑 Backend process exited with code ${code}`);
      process.exit(code);
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down backend...');
      backend.kill('SIGINT');
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Terminating backend...');
      backend.kill('SIGTERM');
    });

  } catch (error) {
    console.error(`❌ Error starting backend: ${error.message}`);
    process.exit(1);
  }
}

// Start the process
startBackend(); 
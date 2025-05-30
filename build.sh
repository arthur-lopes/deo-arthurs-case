#!/bin/bash

echo "🚀 Starting DEO Platform Build Process..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Build frontend
echo "🔨 Building frontend..."
npm run build

echo "✅ Frontend build completed successfully!"

# Navigate to backend and install dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "✅ Backend dependencies installed successfully!"

echo "🎉 Build process completed! Ready for deployment." 
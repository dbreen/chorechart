#!/bin/bash
# Script to perform a complete clean and rebuild

# Make script exit if any command fails
set -e

echo "Stopping any running processes..."
pkill -f "quasar dev" || true

echo "Clearing application cache..."
rm -rf .quasar
rm -rf node_modules/.cache
rm -rf dist

# Clear browser service worker in Chrome (optional)
echo "NOTE: You may need to manually clear browser cache/application data"

echo "Rebuilding application..."
npm run build

echo "Done! You can now deploy the application with:"
echo "  npm run deploy"
#!/bin/bash

# Create admin user script
# Usage: ./scripts/create-admin.sh

echo "🔐 Creating admin user..."
echo "   Email: alamowner123@gmail.com"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found"
    echo "   Please create .env.local with your Supabase credentials"
    exit 1
fi

# Run the TypeScript script
npm run create-admin


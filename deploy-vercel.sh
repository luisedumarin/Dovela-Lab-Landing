#!/usr/bin/env bash
set -e

PROJECT_DIR="/Users/luisedumarin/Desktop/DOVELA/DOV2"

echo "Working in $PROJECT_DIR"
cd "$PROJECT_DIR"

echo "1/ Installing deps (clean)..."
npm ci

echo "2/ Running vercel-build (installs devDeps and builds)..."
npm run vercel-build

echo "3/ Installing Vercel CLI (global)..."
npm i -g vercel

echo "4/ Login to Vercel (the browser will open). Complete the flow there." 
vercel login

echo "5/ Deploying to production..."
vercel --prod --confirm

echo "Deploy script finished."

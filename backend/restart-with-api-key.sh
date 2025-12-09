#!/bin/bash
# Script to restart backend with Google Translate API key

export GOOGLE_TRANSLATE_API_KEY="AIzaSyCN4N4Ce3vCRr3B8jVBMdufsC8dlyHWkA8"

echo "Stopping existing backend..."
pkill -f "TravelAppApplication" || true
sleep 2

echo "Starting backend with API key..."
cd "$(dirname "$0")"
mvn spring-boot:run


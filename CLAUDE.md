# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tesla Jobs Tracker - A Vue 3 web application for tracking changes in Tesla job listings over time. Users manually paste job data from Tesla's API, and the app visualizes added, removed, and updated positions with filtering capabilities.

## Essential Commands

### Development
- `npm run dev` - Start Vite development server
- `npm run build` - TypeScript check + production build
- `npm run preview` - Preview production build locally
- `npm test` - Run unit tests with Vitest
- `npm run test:ui` - Run tests with UI interface
- `npm run coverage` - Run tests with coverage report

### Data Management
- `node status-downloader/download-status.js public/states` - Fetch new job data from Tesla API and save with incremental ID

### Deployment
- `./deploy.sh` - Build and rsync to production server (139.162.184.89)

## Architecture

### Core Technologies
- Vue 3 with Composition API and TypeScript
- Vite for building
- localStorage for data persistence (compressed with lz-string)

### Key Components
- **App.vue**: Main application orchestrator, handles state management and localStorage
- **Delta.vue**: Calculates and displays job changes between snapshots
- **ListingWrapper.vue**: Renders job listings with filtering
- **Checklist.vue**: Filter UI for locations, departments, and job types

### Data Flow
1. User copies JSON from `https://www.tesla.com/cua-api/apps/careers/state`
2. Pastes into app's input field
3. App compresses and stores in localStorage with timestamp
4. Delta component compares snapshots to show changes
5. Filters apply across location, department, and job type

### Important Patterns
- All data stored in localStorage as compressed strings
- History management shifts when quota exceeded
- Filtering uses three separate Checklist components
- Job IDs are unique identifiers for tracking changes
- TypeScript interfaces in `src/status.ts` define all data structures

### Deployment
Production files deployed to `/home/felix/aux/tesla-job-delta/` on remote server via rsync with `--delete` flag to ensure clean state.
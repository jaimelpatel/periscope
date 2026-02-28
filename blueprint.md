
# Periscope MVP Blueprint

## Overview

This document outlines the plan for building a React Native (Expo) MVP app called Periscope. The app will function as a basic dashcam with smart auto-delete logic.

## Project Outline

### Style and Design

- Dark grayscale theme
- Minimalist UI

### Implemented Features

- None yet.

## Current Plan

1.  **Create Project Structure:**
    -   `src/firebase.js`
    -   `src/TripService.js`
    -   `src/screens/HomeScreen.js`
    -   `src/screens/TripsScreen.js`
    -   `src/App.js`

2.  **Implement Core Features:**
    -   **HomeScreen:**
        -   Live camera preview (`expo-camera`).
        -   "Start Trip," "End Trip," and "Mark Incident" buttons.
        -   Trip timer display.
    -   **TripsScreen:**
        -   Fetch and display a list of trips from Firestore.
    -   **Trip Logic:**
        -   Start/stop recording and GPS tracking.
        -   Conditional video upload and trip data persistence based on `incidentDetected` flag.

3.  **Set up Firebase:**
    -   Use v9 modular SDK for Firestore and Storage.

4.  **Configure Navigation:**
    -   Use a basic stack navigator if needed.

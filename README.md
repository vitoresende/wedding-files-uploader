# Wedding Photo Uploader Project

## Overview

This project was developed to streamline the process of collecting photos from guests' mobile phones during my wedding. With the assistance of Chat GPT, the development was expedited, although it may contain some imperfections and might not adhere to the best practices. However, I am sharing it with the hope that it can be of help to others.

## Setup

To configure the project, follow these steps:

1. **Firebase Setup:**

   - Initialize Firebase.
   - Enable both Firestore and Storage in the latest mode.

2. **Basic Firebase Commands:**
   - Deploy functions: `firebase deploy --only functions`
   - Deploy hosting: `firebase deploy --only hosting`
   - Full deploy: `firebase deploy`

## Running Locally

To run the project locally, you can use the following commands:

- Start the development server: `npm start`
- Build for production: `npm run build`

After running the development server, you can preview the project by visiting [http://localhost:3000/?code=testcode](http://localhost:3000/?code=testcode). Please note that due to cost considerations, photo uploads are disabled in this preview mode.

## Disclaimer

This project was created to serve a specific purpose and was developed rapidly with the aid of Chat GPT. As a result, there may be some errors and it may not adhere to best practices. It is shared here in the hope that it may be useful to others.

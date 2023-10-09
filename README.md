# Wedding Photo Uploader Project

## Overview

This project was developed to streamline the process of collecting photos from guests' mobile phones during my wedding. With the assistance of Chat GPT, the development was expedited, although it may contain some imperfections and might not adhere to the best practices. However, I am sharing it with the hope that it can be of help to others.

The project is hosted [here](https://wedding-files-uploader.web.app/?code=testcode) for testing purposes. Please note that due to cost considerations, file uploads are disabled in this preview mode.

## Configuration

### Environment Variables

Before running the project, make sure to set up the necessary environment variables:

1. Inside the `/functions` directory, edit the existing `.env` file to configure the code used for checking if the person has entered the correct code to prevent unauthorized photo submissions.

```env
ATTR_CODE=your_secret_code_here
```

2. In the project root directory, edit the existing `.env` file to configure Firebase.

```env
REACT_APP_FIREBASE_CONFIG={"apiKey": "your_firebase_api_key","authDomain": "your_firebase_auth_domain","projectId": "your_firebase_project_id","storageBucket": "your_firebase_storage_bucket","messagingSenderId": "your_firebase_messaging_sender_id","appId": "your_firebase_app_id","measurementId": "your_firebase_measurement_id"}
```

Remember to replace `your_secret_code_here` and the Firebase variables with your actual values.

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

After running the development server, you can preview the project by visiting [http://localhost:3000/?code=testcode](http://localhost:3000/?code=testcode).

## Disclaimer

This project was created to serve a specific purpose and was developed rapidly with the aid of Chat GPT. As a result, there may be some errors and it may not adhere to best practices. It is shared here in the hope that it may be useful to others.

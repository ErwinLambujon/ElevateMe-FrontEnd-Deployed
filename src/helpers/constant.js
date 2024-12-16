


// constants/api.js

// Development/local environment;
export const API_BASE_URL_DEV = 'https://babyjoy456.pythonanywhere.com';

//local domain change it to http://localhost:8000, but nag testing pako sa deployed nga backend using undeployed frontend

// Production environment (hosted on Vercel and PythonAnywhere)

export const API_BASE_URL_PROD = 'https://babyjoy456.pythonanywhere.com';
// console.log("AsSAdasd" + API_BASE_URL);

// Use the appropriate base URL based on your environment
export const API_BASE_URL = process.env.NODE_ENV === 'production' ? API_BASE_URL_PROD : API_BASE_URL_DEV;
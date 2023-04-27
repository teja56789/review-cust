// Import Firebase Web SDK modules
const { initializeApp } = require('firebase/app');
const { isSupported, getAnalytics } = require('firebase/analytics');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8YeVsbY8EbYvdIv2nSDJx4jc3eQkFXUg",
  authDomain: "review-cc854.firebaseapp.com",
  databaseURL: "https://review-cc854-default-rtdb.firebaseio.com",
  projectId: "review-cc854",
  storageBucket: "review-cc854.appspot.com",
  messagingSenderId: "1081818807202",
  appId: "1:1081818807202:web:c49416bc828c3e808090fb",
  measurementId: "G-S3W6EY49WN"
};

// Initialize Firebase Web SDK
const app = initializeApp(firebaseConfig);
if (typeof window !== 'undefined' && isSupported()) {
  const analytics = getAnalytics(app);
}

// Import Firebase Admin SDK and your service account key file
const admin = require('firebase-admin');
const serviceAccount = require('./review-cc854-firebase-adminsdk-nx6wq-327dc4fd60.json'); // replace with your own key file

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL
});

// Get a database reference
const db = admin.database();

// Import the Express framework
const express = require('express');

// Create an instance of the Express framework
const app2 = express();

// Define a function to store data into the database
function storeData(restaurentName, reviewerName, rating, reviewText) {
  const reviewsRef = db.ref('reviews');
  const newReviewRef = reviewsRef.push();
  newReviewRef.set({
    restaurentName: restaurentName,
    reviewerName: reviewerName,
    rating: rating,
    reviewText: reviewText,
    createdAt: new Date().toISOString(),
  });
}

// Define a route to handle POST requests to the /submit-review endpoint
app2.post('/submit-review', (req, res) => {
  // Get the review data from the request body
  const { restaurentName, reviewerName, rating, reviewText } = req.body;

  // Store the review data in the database
  storeData(restaurentName, reviewerName, rating, reviewText);

  // Send a response back to the client
  res.send('Review submitted successfully.');
});

// Define a route to handle GET requests to the /recent-reviews endpoint
app2.get('/recent-reviews', (req, res) => {
  // Get the most recent 10 reviews from the database
  const reviewsRef = db.ref('reviews').orderByChild('createdAt').limitToLast(10);
  reviewsRef.once('value', snapshot => {
    const reviews = [];
    snapshot.forEach(childSnapshot => {
      const review = childSnapshot.val();
      reviews.unshift(review);
    });
    // Send the reviews back to the client
    res.send(reviews);
  });
});

// Serve the static files in the public directory
app2.use(express.static('public'));

// Start the server
app2.listen(3000, () => {
  console.log('Server listening on port 3000');
});

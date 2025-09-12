// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Fetch and update sensor data
function updateSensors() {
  db.ref("sensors").on("value", snapshot => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      document.getElementById("humidity").innerText = `Humidity: ${data.humidity}%`;
      document.getElementById("temperature").innerText = `Temperature: ${data.temperature}°C`;
      document.getElementById("ph").innerText = `pH: ${data.ph}`;
      document.getElementById("tds").innerText = `TDS: ${data.tds} ppm`;
      document.getElementById("turbidity").innerText = `Turbidity: ${data.turbidity} NTU`;
      document.getElementById("gas").innerText = `Gas: ${data.gas} ppm`;
    } else {
      console.log("No data available");
    }
  });
}

updateSensors();

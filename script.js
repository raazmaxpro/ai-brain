// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC4f2s1w2TPhqHofy2Yr2lth7-1aPFnHVw",
  authDomain: "pattern-genius.firebaseapp.com",
  databaseURL: "https://pattern-genius-default-rtdb.firebaseio.com",
  projectId: "pattern-genius",
  storageBucket: "pattern-genius.appspot.com",
  messagingSenderId: "418832736293",
  appId: "1:418832736293:web:83e7b4ee51701348d19fcc"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);

// End session button Logic
  document.getElementById("endSessionBtn").addEventListener("click", () => {
    fetch("https://raazmaxpro.github.io/ai-brain/end-session", {
      method: "POST"
    })
    .then(res => res.text())
    .then(data => {
      alert("✅ Session ended successfully: " + data);
    })
    .catch(err => {
      alert("❌ Failed to end session: " + err);
    });
  });

// Data pull
function fetchPrediction() {
    fetch('https://raazmaxpro.github.io/ai-brain/get-latest-predictions')
    .then(response => response.json())
    .then(data => {
        document.getElementById('predictionSection').innerHTML = `
            🎯 Color: <b>${data.color}</b><br>
            🏁 Result: <b>${data.result}</b><br>
            ⏱️ Period: <b>${data.period}</b>
        `;
    })
    .catch(err => console.error('Prediction fetch failed:', err));
}



// ✅ Save Button Logic
document.getElementById("saveBtn").addEventListener("click", function () {
  const period = document.getElementById("period").value.trim();
  const bigSmall = document.getElementById("bigSmall").value;
  const color = document.getElementById("color").value;

  if (!period || !bigSmall || !color) {
    alert("Please fill all fields!");
    return;
  }

  const db = firebase.database();
  const sessionRef = db.ref("live_sessions").push();
  const sessionData = {
    period,
    bigSmall,
    color,
    timestamp: new Date().toISOString()
  };

  sessionRef.set(sessionData)
    .then(() => {
      console.log("✅ Data saved to Firebase");

      // ✅ Add to table
      const table = document.getElementById("tableBody");
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${period}</td>
        <td>${bigSmall}</td>
        <td>${color}</td>
      `;
      table.prepend(row);

      // ✅ Clear inputs
      document.getElementById("period").value = "";
      document.getElementById("bigSmall").selectedIndex = 0;
      document.getElementById("color").selectedIndex = 0;

      // 🧠 Call actual AI backend for prediction
      fetch("https://raazmaxpro.github.io/ai-brain/latest-prediction")
        .then((response) => {
          if (!response.ok) {
            throw new Error("No prediction found");
          }
          return response.json();
        })
        .then((data) => {
          const { predicted_color, predicted_big_small } = data;
          document.getElementById("predictionText").textContent =
            `🧠 AI predicts: ${predicted_color} - ${predicted_big_small}`;
        })
        .catch((error) => {
          console.error("Prediction error:", error);
          document.getElementById("predictionText").textContent =
            "❌ No prediction available right now.";
        });
    })
    .catch((error) => {
      console.error("❌ Firebase Error:", error);
    });
});


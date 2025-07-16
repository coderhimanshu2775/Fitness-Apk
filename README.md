# 🏋️‍♂️ FitnessTrackerApp

**FitnessTrackerApp** is a futuristic, dark-themed mobile app built with **React Native + Expo**, designed to help users monitor and improve their fitness goals. It includes tracking for water intake, steps, calories burned, sleep hours, and more — all in a modern and intuitive interface.

## 📲 Download the App (APK)

Click below to download and install the latest version:

**👉 [Download APK](https://expo.dev/accounts/coderhimanshu2775/projects/FitnessTrackerApp/builds/c1f400ff-473d-4aa5-ac6a-9b32b6b81c0d)**

---

## ✨ Features

- 🔐 **Authentication** (Firebase-based login/signup)
- 🚶 **Step Counter** using device Pedometer
- 💧 **Water Intake Tracker**
- 🔥 **Calories Burned Estimator**
- 💤 **Sleep Tracking**
- 🧠 **Goal Management**
- 💪 **Workout Logger & Recommendations**
- 📊 **Progress Dashboard** with interactive graphs
- 📱 **Modern UI** built with `react-native-paper` and `expo-linear-gradient`

---

## 🛠 Tech Stack

- **Framework**: React Native + Expo
- **Firebase**: Auth & Firestore
- **Storage**: AsyncStorage
- **Animations**: Lottie, Reanimated
- **Graphs**: react-native-chart-kit
- **Design System**: react-native-paper
- **Native APIs**: Pedometer via `expo-sensors`

---

## 🚀 Getting Started (For Developers)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/FitnessTrackerApp.git
cd FitnessTrackerApp
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the App

```bash
npm start
```

Then follow the on-screen instructions to run on Android, iOS, or web via Expo.

---

## 🔐 Firebase Setup

Replace the Firebase configuration inside `firebase.js` with your own credentials if you're forking this project:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  ...
};
```

---

## 📁 Project Structure

```
/components         → UI & feature components (Login, Tracker, Dashboard)
firebase.js         → Firebase config & initialization
App.js              → App container & logic
app.json            → Expo project config
eas.json            → EAS build config
index.js            → App entry point
```

---

## 📦 Dependencies

Key libraries used:

- `expo`, `react-native`, `react`
- `firebase`
- `@react-native-async-storage/async-storage`
- `expo-sensors`, `expo-notifications`
- `react-native-paper`, `react-native-chart-kit`
- `react-native-reanimated`, `lottie-react-native`

See `package.json` for the full list.

---

## 🙌 Author

**Himanshu Singh**  
📧 `coderhimanshu2775` on [Expo.dev](https://expo.dev/accounts/coderhimanshu2775)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 💬 Feedback & Support

Feel free to open issues or submit PRs. If you like the project, consider starring the repository!

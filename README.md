# 🏋️‍♂️ FitnessTrackerApp

**FitnessTrackerApp** is a futuristic, dark-themed mobile app built with **React Native + Expo**, designed to help users monitor and improve their fitness goals. It includes tracking for water intake, steps, calories burned, sleep hours, and more — all in a modern and intuitive interface.

## 📸 App Screenshots

Here are some in-app previews of **FitnessTrackerApp**:

<p align="center">
  <img src="![1](https://github.com/user-attachments/assets/5f03469a-db44-45a7-a225-c9ba7b5e8161)
" width="250"/>
  <img src="![2](https://github.com/user-attachments/assets/439b929e-1d03-4989-9a12-2d25ff2f1e91)
" width="250"/>
  <img src="![3](https://github.com/user-attachments/assets/aa91e981-96f0-4b5a-942c-cf504ec4bfb8)
" width="250"/>
  <br/>
  <img src="![4](https://github.com/user-attachments/assets/7e1b6d6a-f5f6-4c51-8f5d-740ab511100a)
" width="250"/>
  <img src="![5](https://github.com/user-attachments/assets/1a1aebcb-e564-4e7d-a523-d33c0e0033ee)
" width="250"/>
  <img src="![6](https://github.com/user-attachments/assets/773bae8b-976f-437d-84c0-446493e9f1c3)
" width="250"/>
  <img src="![7](https://github.com/user-attachments/assets/e6198b64-adf9-44ce-b92b-0fbfc5ff475c)
" width="250"/>
</p>

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

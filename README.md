react-native-github-user-profile

project setup
```bash
#clone this repository / download
yarn #using yarn
#OR
npm install #using npm
```

to run on iOS device
```
cd ios && pod install && cd ..
react-native run-ios
```

to run on Android device
```
react-native run-android
```

to build APK:
configure your keystore config path on android/app/build.gradle
```
cd android && ./gradlew assembleRelease
cd app/build/outputs/apk/release
```
you should see generated apk named app-release.apk

to build IPA:
open ios/githubprofile/githubprofile.xcworkspace

go to Products -> Analyze

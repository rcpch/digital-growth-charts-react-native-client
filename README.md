# digital-growth-charts-react-native-client

![Github Licence](https://img.shields.io/github/license/rcpch/digital-growth-charts-react-native-client)

A demo React Native client to render results from the digital growth charts API

## Installation Instructions

Requires either a working Xcode environment for the iOS client, or Android Studio environment for Android. To set up an enviroment, please follow the instructions from the React Native website (**note**: this project is set up with the React Native CLI, not the expo CLI).

[https://reactnative.dev/docs/environment-setup](https:///reactnative.dev/docs/environment-setup)

Next, navigate to the root directory of the project and make a .env file with the following variables:

`API_LOCAL_BASE_IOS=http://localhost:5000`

`API_LOCAL_BASE_ANDROID=http://10.0.2.2:5000`

`API_LAN_BASE=http://192.168.86.34:5000`

`API_REAL_BASE=https://api.rcpch.ac.uk/growth/v1`

`API_KEY=placeholder`

(Enter the base addresses / api key which best suit your setup. Note the IP address in the example above for android local- this address points to localhost in android simulators).

**To state the obvious:** storing an API key in an environment variable file (or writing it into code) is not suitable for a production app. The API key will be copied as plain text into the application bundle at compile time and therefore easily compromised. See [https://reactnative.dev/docs/security](https://reactnative.dev/docs/security)

Install the necessary dependencies:

`npm install`

To complete iOS installation:

`npx pod-install ios`

The project should now be ready to run.

## Running

For best results, run the app from within Xcode or Android Studio. Open ./ios/RCPCHGrowth.xcworkspace (**NOT** RCPCHGrowth.xcodeproj) for iOS and ./android/ folder from within Android Studio for Android.

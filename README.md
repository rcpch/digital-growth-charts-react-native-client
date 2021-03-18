# digital-growth-charts-react-native-client

A react-native client to render results from the digital growth charts api

## Installation Instructions

Requires either a working Xcode environment for the iOS client, or Android Studio environment for Android. To set up an enviroment, please follow the instructions from the React Native website:

**Note**: this project is set up with the React Native CLI, not the expo CLI.

[https://reactnative.dev/docs/environment-setup](https:///reactnative.dev/docs/environment-setup)

Next, navigate to the root directory of the project and make a .env file with the following variables:

`API_LOCAL_BASE_IOS=http://localhost:5000`

`API_LOCAL_BASE_ANDROID=http://10.0.2.2:5000`

`API_LAN_BASE=http://192.168.86.34:5000`

`API_REAL_BASE=https://api.rcpch.ac.uk/growth/v1`

`API_KEY=placeholder`

(Enter the base addresses / api key which best suit your setup. Note the IP address in the example above for android local- this address points to localhost in android simulators).

Now run 'npm install' to install the necessary dependencies.

For iOS, run 'npx pod-install ios'

The project should now be ready to run.

## Running

For best results, run the app from within Xcode or Android Studio. Open ./ios/RCPCHGrowth.xcworkspace for iOS and ./android/ folder from within Android Studio for Android.

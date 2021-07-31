<p align="center">
    <img width="200px" src="https://github.com/rcpch/digital-growth-charts-documentation/raw/live/docs/_assets/_images/rcpch_logo.png"/>
    <p align="center">Designed and built by the RCPCH, by clinicians for clinicians.</p>
</p>
<p align="center">
    <img align="center" width="100px" src="https://github.com/rcpch/digital-growth-charts-documentation/raw/live/docs/_assets/_images/htn-awards-winner-2020-logo.jpg"/>
    <img align="center" width="100px" src="https://github.com/rcpch/digital-growth-charts-documentation/raw/live/docs/_assets/_images/logo-block-outline-sm.png"/>
    <p align="center">Winner 2020 HTN Health Tech Awards - Best Health Tech Solution</p>
    <p align="center">This project is part of the <a href="https://publicmoneypubliccode.org.uk/">Public Money Public Code</a> community</p>
</p>

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

## Troubleshooting

### Changes to environment variables are not reflected when the application is run

Try resetting the metro cache:

`npx react-native start --reset-cache`

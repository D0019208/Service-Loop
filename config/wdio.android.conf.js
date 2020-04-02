const path = require('path');
const config = require('./wdio.shared.conf').config;

config.capabilities = [
    {
        platformName: 'Android',
        platformVersion: '9',
        deviceName: 'emulator-5554',
        app: path.join(process.cwd(), 'platforms/android/app/build/outputs/apk/debug/app-debug.apk'),
        autoWebview: true,
    },
];

exports.config = config;

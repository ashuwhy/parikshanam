# Parikshanam (Expo)

## iOS native build - Swift 6 / Xcode 16

If `expo run:ios` fails with **main actor-isolated** errors inside `expo-modules-core` (Swift strict concurrency), this project applies **`SWIFT_STRICT_CONCURRENCY = minimal`** to all CocoaPods via [`plugins/withPodfileSwiftConcurrency.js`](plugins/withPodfileSwiftConcurrency.js) during `expo prebuild`.

After changing the plugin or upgrading Expo, regenerate native projects and reinstall pods:

```bash
cd apps/mobile
npx expo prebuild --clean
cd ios && pod install && cd ..
```

Optional clean (if Xcode still caches old settings):

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData
npx expo run:ios
```

If you maintain a **custom** `ios/Podfile`, merge the same `post_install` snippet from the plugin by hand - do not duplicate `post_install` blocks.

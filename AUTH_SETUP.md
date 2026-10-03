# MovieZone social authentication setup

The application code supports Firebase email/password, Google, and Facebook authentication on web, Android, and iOS. Provider console configuration is still required before Google or Facebook can authenticate real users.

## Current priority: Google first

The Google provider is enabled in the MovieZone Firebase project, and the web client ID is configured. On web, the Google button reaches the account chooser; a complete sign-in, refresh, and sign-out test still needs an account selected. The current Android app cannot use Google sign-in until a new development APK containing `RNGoogleSignin` is installed. Register an Android OAuth client for `com.moviezone.app` using the SHA-1 of the certificate that signs **that APK**. The Android client ID alone does not replace this package-and-certificate registration.

The EAS project is [@john_maestro/moviezone](https://expo.dev/accounts/john_maestro/projects/moviezone). Its current Android development keystore has SHA-1 `4D:0E:FF:B6:2E:BE:57:E5:87:06:94:CF:29:34:8B:C2:88:E7:80:74` and SHA-256 `C7:14:40:4F:3C:7D:F6:5C:9C:B0:18:C8:BD:07:28:C9:38:E6:AF:A2:C5:D9:5A:44:B4:00:E5:53:4C:9E:FA:A4`. Recheck these in EAS Credentials if the keystore changes. A later Play Store release can use a different signing certificate and needs that fingerprint registered too.

The Android OAuth client `MovieZone Android EAS development` is now registered in Google Cloud with the package and SHA-1 above. Its public client ID is `133523096433-5be7ide6ipvh7tl6unsd1hsrdbbh50ho.apps.googleusercontent.com`. It is also recorded in local `.env` and the EAS development environment. The native Firebase credential exchange still uses the **web** client ID as its token audience.

The first [Android development APK build](https://expo.dev/accounts/john_maestro/projects/moviezone/builds/8a8129b4-2669-4df2-a062-b5d53fa29bd3) finished successfully. Install it from that build page on an Android device, then run `npm run start:dev` on the development computer and open its Metro link inside the installed MovieZone development app. Google account selection and the Firebase sign-in result still require a real device test; a successful build is not proof that login works end to end. This APK was submitted before the Android client ID was recorded in EAS, but that ID is not consumed by the Android runtime; registration of its package and signing certificate is what Google checks. Rebuild if native config or packages change.

Facebook is paused while Meta blocks developer enrollment on the current account. Being signed into Facebook as a user does not create a Meta developer app or provide the App ID and Client Token needed for MovieZone's Facebook Login. Do not use another person's Facebook password or bypass Meta's account protection. A coworker who already administers a Meta app can configure it and grant the appropriate access, or this can resume when Meta allows enrollment. Until then, do not claim Facebook sign-in is verified.

## 1. Firebase Authentication

1. Open the Firebase project used by the `EXPO_PUBLIC_FIREBASE_*` values.
2. Go to **Authentication > Sign-in method**.
3. Enable **Email/Password**, **Google**, and **Facebook**.
4. For Facebook, copy the OAuth redirect URI shown by Firebase. It normally resembles `https://YOUR_AUTH_DOMAIN/__/auth/handler`.
5. Enter the Meta App ID and App Secret in Firebase. The App Secret belongs only in the Firebase console—never in this repository or `.env`.
6. Under **Authentication > Settings > Authorized domains**, add the web domains that will host MovieZone. Keep `localhost` for local web development.

## 2. Google Cloud / Firebase configuration

Create OAuth clients for each platform in the same Google/Firebase project:

- Web client: add its ID as `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.
- Android client: use package `com.moviezone.app`, add the development and release SHA-1/SHA-256 fingerprints, and place its ID in `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` for documentation/config tracking.
- iOS client: use bundle ID `com.moviezone.app` and add its ID as `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`.

The native Firebase credential exchange uses the web client ID as the ID-token audience. The iOS ID also generates the reversed URL scheme during Expo prebuild.

To print the Android debug signing fingerprints from a generated native project, use Gradle's `signingReport`, or obtain the EAS credential fingerprints from the Expo dashboard when using EAS Build.

## 3. Meta / Facebook configuration

1. Create or select a Meta app and add the **Facebook Login** product.
2. Add `EXPO_PUBLIC_FACEBOOK_APP_ID` and the Meta **Client Token** as `EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN`.
3. Do not add the Meta App Secret to the client application.
4. Add the Firebase OAuth redirect URI to **Facebook Login > Settings > Valid OAuth Redirect URIs**.
5. Configure the Android platform with package `com.moviezone.app`, the required key hashes, and the production store URL when Meta requires it.
6. Configure the iOS platform with bundle ID `com.moviezone.app`.
7. Add testers while the Meta app is in development mode, or complete Meta review/live-mode requirements before public release.

Advertising ID collection and automatic app-event logging are disabled in `app.config.ts`; this login implementation does not request tracking permission. iOS uses Facebook Limited Login with a cryptographically generated nonce; Android uses the Facebook access token.

## 4. Local environment

Copy missing values from `.env.example` into `.env`. OAuth client IDs, the Facebook App ID, and the Facebook Client Token are public client configuration. Google client secrets and the Facebook App Secret must never be placed in an Expo environment variable.

Restart Expo after changing `.env`:

```sh
npx expo start --clear
```

## 5. Native development build

Google and Facebook native SDKs do not run in Expo Go. The error `RNGoogleSignin could not be found` means the app binary on the phone does not include the Google native module. Restarting Metro or scanning a new Metro QR code cannot add a module to an already-installed app. Install a newly built development APK first.

Before building, set the Google web client ID and register the Android OAuth client for `com.moviezone.app` with the SHA fingerprints of the certificate that signs the APK. For Facebook, set both the App ID and Client Token **before** building: the Facebook config plugin is enabled only when both are present. The Android Google module is linked from the installed package; its Expo config plugin is used here only to add the iOS URL scheme when the iOS client ID is present. Leave the Facebook App Secret in Firebase/Meta consoles, never in the app.

On a machine with Android SDK and `adb`, build and install locally:

```sh
npx expo run:android
```

If there is no local Android SDK, use the `development` profile in `eas.json` to produce an installable APK. Sign in to the correct Expo account and link the project if EAS prompts you. Set **all** required `EXPO_PUBLIC_*` values from `.env.example` in that project's EAS **development** environment, including Firebase and TMDB values as well as the OAuth values. Local `.env` is git-ignored and is not a reliable source for a cloud build. These values are embedded in the client and must not contain provider secrets. Then run:

```sh
npx eas-cli build --platform android --profile development
```

Open the completed EAS build link on the Android phone and install its APK. Its installation QR code is **not** the Metro QR code. After installation, run `npm run start:dev`, then open its Metro link from inside the installed development build. For iOS, run `npx expo run:ios` on macOS or build with EAS; an iOS device build also needs Apple signing. Rebuild whenever native packages, OAuth native IDs, Facebook app configuration, bundle identifiers, or config-plugin options change. A Metro restart only updates JavaScript.

`expo-dev-client` is installed. Start Metro for an installed development build with `npx expo start --dev-client`. Missing provider values leave their config plugins disabled; fill them in before building. The Google plugin supplies the iOS URL scheme; Android identifies the client using the registered package and signing certificate. No native Firebase service files are required by this JS-SDK setup.

For a quick preview in Expo Go, run `npm run start:go`. For the installed development build with native Google/Facebook support, run `npm run start:dev`. Each command produces a different QR code; scan the one for the app actually installed on the phone. These LAN links work only while Metro stays running and the phone and computer are on the same reachable Wi-Fi network. If the computer changes networks or IP address, restart Metro and share the new QR code. The web URL `http://localhost:8081` is only for a browser on the computer, not for a phone or remote teammate.

Email/password registration signs the user in automatically. Social registration does not require email/password form fields, but the registration screen still requires its terms checkbox. Account data held in memory is reset when switching users.

## 6. Web verification

Run `npm run web`, then verify:

- Google and Facebook popups complete and return to MovieZone.
- Popup cancellation and popup blocking show friendly errors.
- A returning user remains signed in after refresh.
- Sign-out returns to the Intro screen.
- The deployed web origin is listed in Firebase authorized domains and the provider consoles.

## 7. Native verification

On physical devices or development builds, verify new and returning users, cancellation, network failure, sign-out, and session restoration after terminating and reopening the app. Also test an email already associated with a different provider; MovieZone should guide the user to their existing sign-in method instead of creating a duplicate account.

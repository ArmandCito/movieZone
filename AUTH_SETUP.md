# MovieZone social authentication setup

The application code supports Firebase email/password, Google, and Facebook authentication on web, Android, and iOS. Provider console configuration is still required before Google or Facebook can authenticate real users.

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

Google and Facebook native SDKs do not run in Expo Go. After the native provider values are present, create a new development build so Expo can apply the config plugins:

```sh
npx expo prebuild
npx expo run:android
```

For iOS, run `npx expo run:ios` on macOS, or use EAS Build. Rebuild whenever the OAuth native IDs, Facebook app configuration, bundle identifiers, packages, or config-plugin options change.

`expo-dev-client` is installed. Start Metro for an installed development build with `npx expo start --dev-client`. Missing provider values leave their config plugins disabled; fill them in before building. The Google plugin supplies the iOS URL scheme; Android identifies the client using the registered package and signing certificate. No native Firebase service files are required by this JS-SDK setup.

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

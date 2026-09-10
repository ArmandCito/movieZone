import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { getMovieVideos } from '../services/tmdbService';
import { useUserData } from '../context/UserDataContext';
import { useAuth } from '../context/AuthContext';
import { GlassCard, GlassButton, LiquidBackground } from '../components/glass';
import { colors, radii } from '../theme/glass';

interface VideoEntry {
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
}

// Desktop Chrome user-agent: prevents YouTube from detecting a mobile in-app
// browser and redirecting the player to the YouTube app / m.youtube.com.
const ANDROID_DESKTOP_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

/**
 * Builds a complete HTML document that embeds the video iframe directly inside
 * the WebView, so playback happens in-app instead of redirecting to YouTube.
 */
const buildEmbedHtml = (video: VideoEntry, startSeconds: number): string => {
  const start = Math.max(0, Math.floor(Number(startSeconds) || 0));
  const isVimeo = String(video.site || '').toLowerCase() === 'vimeo';
  const src = isVimeo
    ? `https://player.vimeo.com/video/${video.key}?autoplay=1&transparent=0&title=0&byline=0&portrait=0`
    : `https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&playsinline=1&rel=0&modestbranding=1&start=${start}`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>
  html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; }
  #player { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
</style>
</head>
<body>
<iframe id="player"
  src="${src}"
  frameborder="0"
  allow="autoplay; encrypted-media; picture-in-picture; accelerometer; clipboard-write; gyroscope; web-share; fullscreen"
  allowfullscreen="true"></iframe>
</body>
</html>`;
};

export default function PlayerScreen({ navigation, route }: any) {
  const { movieId, title, resumeAt = 0 } = route?.params || {};
  const { saveWatchProgress, clearWatchProgress } = useUserData();
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [, forceTick] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const watchSecondsRef = useRef(Math.max(0, Number(resumeAt) || 0));

  useEffect(() => {
    loadTrailers();
  }, [movieId]);

  useEffect(() => {
    // Tick every 2s so "Continue Watching" updates while playing.
    const interval = setInterval(() => {
      if (startTimeRef.current !== null) {
        watchSecondsRef.current = Math.max(0, Number(resumeAt) || 0) + (Date.now() - startTimeRef.current) / 1000;
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [resumeAt]);

  // Persist progress before leaving the screen.
  useEffect(() => {
    return () => {
      if (startTimeRef.current !== null && user?.idToken) {
        const item = {
          movieId: Number(movieId),
          title: route?.params?.title || title || 'Movie',
          poster_path: route?.params?.poster || null,
          backdrop_path: route?.params?.backdrop || null,
          vote_average: Number(route?.params?.voteAverage) || 0,
          progressSeconds: Math.round(watchSecondsRef.current || 0),
        };
        if (item.progressSeconds > 5) saveWatchProgress(item);
      }
    };
  }, [movieId, title, user?.idToken]);

  const loadTrailers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getMovieVideos(movieId);
      let result = data.results || [];
      // Prefer official trailers/teasers hosted on YouTube.
      const rank = (v: VideoEntry) =>
        (v.site !== 'YouTube' ? 3 : v.type === 'Trailer' ? 0 : v.type === 'Teaser' ? 1 : v.type === 'Clip' ? 2 : 3);
      result.sort((a: any, b: any) => rank(a) - rank(b) || Number(b.official) - Number(a.official));
      setVideos(result);
      if (result.length > 0) setActiveIndex(0);
    } catch (err: any) {
      setError(err.message || 'Failed to load video');
    } finally {
      setIsLoading(false);
    }
  };

  const activeVideo = activeIndex >= 0 ? videos[activeIndex] : null;

  const handlePlay = () => {
    if (!user?.idToken) {
      Alert.alert('Sign in required', 'Please sign in to start watching.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }
    if (!activeVideo) {
      setError('No playable source is available for this title yet.');
      return;
    }
    startTimeRef.current = Date.now();
    watchSecondsRef.current = Math.max(0, Number(resumeAt) || 0);
    forceTick((n) => n + 1); // re-render to embed & autoplay
  };

  const handleSelectVideo = (index: number) => {
    setActiveIndex(index);
    startTimeRef.current = null;
    watchSecondsRef.current = 0;
    forceTick((n) => n + 1);
  };

  const back = () => {
    startTimeRef.current = Date.now();
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.root}>
        <LiquidBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Finding sources for this title...</Text>
          </View>
        </SafeAreaView>
        </LiquidBackground>
      </View>
    );
  }

  const playerSource = activeVideo
    ? { html: buildEmbedHtml(activeVideo, Math.max(0, Number(resumeAt) || 0)) }
    : null;

  return (
    <View style={styles.root}>
      <LiquidBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Top bar */}
        <GlassCard style={styles.topBar} radius={radii.md} intensity={58} padded={false}>
          <TouchableOpacity onPress={back} style={styles.topBtn}>
            <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.topTitle} numberOfLines={1}>
            Now Watching
          </Text>
          <TouchableOpacity style={styles.topBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="tv-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </GlassCard>

        {/* Player area */}
        <View style={styles.playerArea}>
          {startTimeRef.current !== null && activeVideo && playerSource ? (
            <WebView
              key={`${activeVideo.key}-${startTimeRef.current}`}
              source={playerSource}
              style={styles.webview}
              javaScriptEnabled
              domStorageEnabled
              setSupportMultipleWindows={false}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              allowsFullscreenVideo
              originWhitelist={['*']}
              userAgent={Platform.OS === 'android' ? ANDROID_DESKTOP_UA : undefined}
              startInLoadingState
              renderLoading={() => (
                <View style={styles.webviewLoading}>
                  <ActivityIndicator size="large" color={colors.accent} />
                </View>
              )}
              onShouldStartLoadWithRequest={(event) => {
                // Guard: allow only the in-page document and its embedded iframe.
                const url = event.url || '';
                if (event.isTopFrame !== false) {
                  return (
                    url.startsWith('data:') ||
                    url.startsWith('about:') ||
                    url.startsWith('file:') ||
                    url.startsWith('https://www.youtube-nocookie.com') ||
                    url.startsWith('https://www.youtube.com') ||
                    url.startsWith('https://player.vimeo.com') ||
                    !url.startsWith('intent:')
                  );
                }
                return true;
              }}
              onOpenWindow={() => {
                /* Popup/new-window requests are ignored: nothing opens outside the app. */
              }}
              onError={() => setError('Unable to reach the video player.')}
              onHttpError={(syntheticEvent) =>
                setError(`Video player error (HTTP ${syntheticEvent.nativeEvent.statusCode}).`)
              }
            />
          ) : (
            <GlassCard style={styles.videoPlaceholder} radius={0} intensity={55} tintColor={colors.glassFillSubtle} padded={false}>
              {activeVideo ? (
                <>
                  <Ionicons name="play-circle-outline" size={64} color={colors.textMuted} />
                  <Text style={styles.videoPlaceholderText}>
                    Tap play to watch "{activeVideo.name || 'Trailer'}"
                  </Text>
                  <GlassButton variant="primary" onPress={handlePlay} style={styles.playBig}>
                    <View style={styles.playBigInner}>
                      <Ionicons name="play" size={22} color={colors.textPrimary} />
                      <Text style={styles.playText}>
                        {Number(resumeAt) > 5 ? 'Resume' : 'Watch'}
                      </Text>
                    </View>
                  </GlassButton>
                  {!user?.idToken && (
                    <Text style={styles.plugSignedInText}>Sign in to track your progress</Text>
                  )}
                </>
              ) : (
                <>
                  <Ionicons name="film-outline" size={48} color={colors.textMuted} />
                  <Text style={styles.noSourceTitle}>No watchable source yet</Text>
                  <Text style={styles.noSourceBody}>
                    The studio has not made this title available for online streaming on
                    MovieZone yet. Check back soon.
                  </Text>
                </>
              )}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </GlassCard>
          )}
        </View>

        {/* Source selector */}
        {activeVideo && (
          <GlassCard style={styles.panel} radius={radii.md} intensity={58}>
            <Text style={styles.panelLabel}>Available sources</Text>
            <Text style={styles.qualityLabel}>
              {activeVideo.type === 'Trailer'
                ? 'Watch official trailer'
                : activeVideo.type === 'Teaser'
                ? 'Watch official teaser'
                : activeVideo.type === 'Clip'
                ? 'Official clip'
                : 'Behind the scenes'}
            </Text>
          </GlassCard>
        )}

        <View style={styles.scroller}>
          {videos.map((v, i) => {
            const isActive = i === activeIndex;
            return (
              <GlassCard
                key={`${v.key}-${i}`}
                style={styles.sourceCard}
                radius={radii.md}
                intensity={58}
                tintColor={isActive ? colors.accentSoft : colors.glassFill}
                padded={false}
              >
                <TouchableOpacity style={styles.sourceCardTouch} onPress={() => handleSelectVideo(i)}>
                  <Ionicons
                    name={isActive ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={isActive ? colors.accent : colors.textMuted}
                  />
                  <View style={styles.sourceInfo}>
                    <Text style={styles.sourceTitle} numberOfLines={1}>
                      {v.name || v.type || 'Trailer'}
                    </Text>
                    <Text style={styles.sourceMeta}>
                      {v.type} • {v.site}
                      {v.official ? ' • Official' : ''}
                    </Text>
                  </View>
                  <Ionicons name="play-circle" size={20} color={isActive ? colors.accent : colors.textMuted} />
                </TouchableOpacity>
              </GlassCard>
            );
          })}
          {videos.length === 0 && (
            <Text style={styles.emptyVideos}>
              No trailers or clips have been published for this title.
            </Text>
          )}
          {error && videos.length > 0 ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
        </View>

        {/* Decorative bottom spacing */}
        <View style={styles.bottomSpacer} />
      </SafeAreaView>
      </LiquidBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgBottom,
  },
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 12,
    marginTop: 8,
  },
  topBtn: {
    padding: 8,
  },
  topTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  playerArea: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000000',
    marginTop: 12,
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  webviewLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  videoPlaceholderText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 18,
  },
  playBig: {
    alignSelf: 'center',
  },
  playBigInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  playText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 6,
  },
  noSourceTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 14,
    textAlign: 'center',
  },
  noSourceBody: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 300,
  },
  plugSignedInText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 12,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  panel: {
    marginHorizontal: 18,
    marginTop: 14,
  },
  panelLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  qualityLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 3,
  },
  scroller: {
    paddingHorizontal: 18,
    marginTop: 12,
    flexShrink: 0,
  },
  sourceCard: {
    marginBottom: 8,
  },
  sourceCardTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  sourceInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 6,
  },
  sourceTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  sourceMeta: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  emptyVideos: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
  },
  bottomSpacer: {
    height: 50,
  },
});

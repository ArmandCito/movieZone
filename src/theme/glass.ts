// Shared "liquid glass" design tokens used across every screen.
// Keep MovieZone's existing dark + red identity, expressed as translucent glass.

export const colors = {
  // Base canvas the glass sits on top of (deep, almost-black navy/red gradient)
  bgTop: '#1c0f16',
  bgMid: '#120a14',
  bgBottom: '#08070c',

  // Decorative liquid blobs floated behind content
  blobRed: 'rgba(229,9,20,0.55)',
  blobPurple: 'rgba(106,61,232,0.45)',
  blobBlue: 'rgba(35,120,255,0.35)',

  accent: '#E50914',
  accentSoft: 'rgba(229,9,20,0.28)',

  // Glass surfaces
  glassFill: 'rgba(255,255,255,0.08)',
  glassFillStrong: 'rgba(255,255,255,0.16)',
  glassFillSubtle: 'rgba(255,255,255,0.05)',
  glassBorder: 'rgba(255,255,255,0.22)',
  glassBorderSoft: 'rgba(255,255,255,0.12)',
  glassHighlight: 'rgba(255,255,255,0.35)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.72)',
  textMuted: 'rgba(255,255,255,0.48)',

  danger: '#FF5D5D',
} as const;

export const radii = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const blur = {
  subtle: 20,
  regular: 40,
  strong: 65,
} as const;

// Common shadow used to lift glass surfaces off the background (iOS + Android)
export const glassShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.35,
  shadowRadius: 20,
  elevation: 10,
} as const;

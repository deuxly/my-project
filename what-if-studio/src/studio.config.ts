// The studio's settings. Every episode renders at this size and frame rate.
export const STUDIO = {
  fps: 30,
  /**
   * The output frame. '9:16' (1080 x 1920, vertical: Shorts, Reels, TikTok) is this studio's default; '16:9' is
   * 1920 x 1080. Shots are always drawn in the 1920 x 1080 world; a vertical episode crops each shot with its
   * `frame` (see engine/episode.tsx).
   */
  aspect: '9:16' as '9:16' | '16:9',
  get width() {
    return this.aspect === '9:16' ? 1080 : 1920;
  },
  get height() {
    return this.aspect === '9:16' ? 1920 : 1080;
  },
  /**
   * A local display face for titles, as a file in public/ (your brand font, say). null uses Bricolage Grotesque
   * from Google Fonts. Example: { family: 'My Brand Font', file: 'fonts/MyBrandFont.woff2', weight: '200 700' }
   */
  titleFont: null as null | { family: string; file: string; weight: string },
};

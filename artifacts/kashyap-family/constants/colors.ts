/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#17342A',
    tint: '#C47A3A',

    // Core surfaces
    background: '#F7F3EC',
    foreground: '#17342A',

    // Cards / elevated surfaces
    card: '#FFFCF7',
    cardForeground: '#17342A',

    // Primary action color (buttons, links, active states)
    primary: '#1F5B45',
    primaryForeground: '#ffffff',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#E8EFE8',
    secondaryForeground: '#1F5B45',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#EDE8DF',
    mutedForeground: '#708078',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#F2D7B5',
    accentForeground: '#8B5224',

    // Destructive actions (delete, error states)
    destructive: '#B94A42',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#DED8CE',
    input: '#DED8CE',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 18,
};

export default colors;

# Property Resolution: UI-First Exhaustive Audit

**Date:** 2025-12-19
**Methodology:** Tracing from `render()` in `PropertyPanel.tsx` / `BodyPanel.tsx` backwards to the data source.

---

# PART 1: The Body Panel (`BodyPanel.tsx`)
*Render logic: Iterates `globalStyleRegistry.getGroups()` defined in `style-properties.ts`.*

| UI Label | Data Source Chain (Exact Logic) | Status |
| :--- | :--- | :--- |
| **Active Theme Display** | `activeThemeObject.name` | ✅ Connected |
| **Page Title** | `bodySettings.pageTitle` | ✅ Connected |
| **Meta Description** | `bodySettings.metaDescription` | ✅ Connected |

### Dynamic Group: Colors
| Property UI | Resolution Logic | Status |
| :--- | :--- | :--- |
| **Primary Color** | `overrides['primaryColor'] ?? theme.styles['primaryColor'] ?? '#2563eb'` | ✅ Connected |
| **Background Color** | `overrides['backgroundColor'] ?? theme.styles['backgroundColor'] ?? '#ffffff'` | ✅ Connected |
| **Text Color** | `overrides['textColor'] ?? theme.styles['textColor'] ?? '#171717'` | ✅ Connected |
| **Link Color** | `overrides['linkColor'] ?? theme.styles['linkColor'] ?? '#2563eb'` | ✅ Connected |
| **Border Color** | `overrides['borderColor'] ?? theme.styles['borderColor'] ?? '#e5e5e5'` | ✅ Connected |

### Dynamic Group: Typography
*Generic Global Type Settings*
| Property UI | Resolution Logic | Status |
| :--- | :--- | :--- |
| **Font Family** | `overrides['fontFamily'] ?? theme.styles['fontFamily'] ?? 'Inter'` | ✅ Connected |
| **Base Font Size** | `overrides['fontSize'] ?? theme.styles['fontSize'] ?? '16px'` | ✅ Connected |
| **Base Line Height** | `overrides['lineHeight'] ?? theme.styles['lineHeight'] ?? '1.5'` | ✅ Connected |

*Heading Specifics*
| Property UI | Resolution Logic | Status |
| :--- | :--- | :--- |
| **H1 Color** | `overrides['h1Color'] ?? theme.styles['h1Color'] ?? '#171717'` | ✅ Connected |
| **H1 Size** | `overrides['h1FontSize'] ?? theme.styles['h1FontSize'] ?? '48px'` | ✅ Connected |
| **H1 Height** | `overrides['h1LineHeight'] ?? theme.styles['h1LineHeight'] ?? '1.2'` | ✅ Connected |
| **H1 Margin** | `overrides['h1MarginBottom'] ?? theme.styles['h1MarginBottom'] ?? '24px'` | ✅ Connected |
| *(Repeated for H2, H3 with respective keys)* | ... | ✅ Connected |
| **Paragraph Color** | `overrides['paragraphColor'] ?? theme.styles['paragraphColor'] ?? '#374151'` | ✅ Connected |
| **Paragraph Size** | `overrides['paragraphFontSize'] ?? theme.styles['paragraphFontSize'] ?? '16px'` | ✅ Connected |
| **Link Decoration** | `overrides['linkTextDecoration'] ?? theme.styles['linkTextDecoration'] ?? 'none'` | ✅ Connected |
| **Quote Background** | `overrides['quoteBg'] ?? theme.styles['quoteBg'] ?? '#f9fafb'` | ✅ Connected |
| **List Spacing** | `overrides['listItemSpacing'] ?? theme.styles['listItemSpacing'] ?? '8px'` | ✅ Connected |

### Dynamic Group: Buttons
| Property UI | Resolution Logic | Status |
| :--- | :--- | :--- |
| **Button Primary Bg** | `overrides['buttonPrimaryBg'] ?? theme.styles['buttonPrimaryBg'] ?? '#2563eb'` | ✅ Connected |
| **Button Primary Text** | `overrides['buttonPrimaryText'] ?? theme.styles['buttonPrimaryText'] ?? '#ffffff'` | ✅ Connected |
| **Button Radius** | `overrides['buttonBorderRadius'] ?? theme.styles['buttonBorderRadius'] ?? '4px'` | ✅ Connected |
| **Button Padding** | `overrides['buttonPadding'] ?? theme.styles['buttonPadding'] ?? '12px 24px'` | ✅ Connected |

### Dynamic Group: Layout & Spacing
| Property UI | Resolution Logic | Status |
| :--- | :--- | :--- |
| **Default Gap** | `overrides['gap'] ?? theme.styles['gap'] ?? '16px'` | ✅ Connected |
| **Container Padding** | `overrides['containerPadding'] ?? theme.styles['containerPadding'] ?? '20px'` | ✅ Connected |
| **Section Padding** | `overrides['sectionPadding'] ?? theme.styles['sectionPadding'] ?? '40px 20px'` | ✅ Connected |
| **Card Padding** | `overrides['cardPadding'] ?? theme.styles['cardPadding'] ?? '24px'` | ✅ Connected |
| **Form Padding** | `overrides['formPadding'] ?? theme.styles['formPadding'] ?? '24px'` | ✅ Connected |

---

# PART 2: The Property Panel (`PropertyPanel.tsx`)
*Render logic: Switches on `component.type`, then renders specific sections.*

### Section: "Content" (Varies by Component)
*These controls are hardcoded in the generic renderer or switch statement.*

| Component | Control Type | Resolution Logic (The "Trail") | Component Default (`properties.ts`) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Button** | Text Input | `props.text || 'Button'` (Hardcoded) | `'Button'` | 🔴 **Ignores Default** (Should read from registry) |
| **Button** | Action Select | `props.actionType || 'link'` | `'link'` | 🔴 **Ignores Default** |
| **Heading** | Text Input | `props.text || ''` | `'Heading'` | 🔴 **Ignores Default** (Shows empty instead of 'Heading') |
| **Heading** | Level Select | `props.level || 'h2'` | `'h2'` | 🔴 **Hardcoded** (Coincidentally matches, but unsafe) |
| **Text** | RichText | `props.text || ''` | *None* | 🔴 **Hardcoded** |
| **Image** | URL Input | `props.src || ''` | `''` | 🔴 **Hardcoded** |
| **Image** | Alt Text | `props.alt || ''` | `''` | 🔴 **Hardcoded** |
| **Video** | URL Input | `props.src || ''` | *None* | 🔴 **Hardcoded** |
| **Video** | Autoplay | `props.autoplay || false` | *None* | 🔴 **Hardcoded** |
| **Input** | Label | `props.label || ''` | `''` | 🔴 **Hardcoded** |
| **Input** | Placeholder | `props.placeholder || ''` | `'Enter text...'` | 🔴 **Ignores Default** (Shows empty!) |
| **Input** | Required | `props.required || false` | `false` | 🔴 **Hardcoded** |
| **Spacer** | Height | `props.height || '32px'` | *None* | 🔴 **Hardcoded** |
| **Divider** | Thickness | `props.thickness || '1px'` | *None* | 🔴 **Hardcoded** |
| **Columns** | Count | `props.columns || 2` | *None* | 🔴 **Hardcoded** |
| **Container** | Scroll | `props.overflow || 'visible'` | `'visible'` | 🔴 **Hardcoded** |

### Section: "Colors" (Common to many)
*Forensic Analysis of `ColorPicker.tsx`: `User Override` -> `Component Default` -> `Theme Default`.*

| Control UI | Resolution Logic (The "Trail") | Component Default (`properties.ts`) | Status |
| :--- | :--- | :--- | :--- |
| **Background Color** | `props.bg` -> `getDefaultProps(type).bg` -> `theme.styles['backgroundColor']` | `#2563eb` (Btn), `#fff` (Card) | ⚠️ **Wrong Theme Key**. Uses Component Default, but falls back to generic `backgroundColor` instead of `buttonPrimaryBg`/`cardBg`. |
| **Text Color** | `props.text` -> `getDefaultProps(type).text` -> `theme.styles['textColor']` | `#ffffff` (Btn) | ⚠️ **Wrong Theme Key**. Uses Component Default, but falls back to generic `textColor`. |

### Section: "Spacing" (Box Model)
*Forensic Analysis of `PropertyPanel.tsx`: `User Override` -> `Component Default` (Theme is bypassed).*

| Control UI | Resolution Logic (The "Trail") | Component Default (`properties.ts`) | Status |
| :--- | :--- | :--- | :--- |
| **Margin (All)** | `props.margin` -> `getDefaultProps(type).margin` -> `0` | `{top:'0'...}` | 🔴 **Skipped Theme**. Uses `properties.ts`, but completely bypasses Theme layer. |
| **Padding (All)** | `props.padding` -> `getDefaultProps(type).padding` -> `0` | `{top:'12'...}` (Btn), `{top:'20'...}` (Card) | 🔴 **Skipped Theme**. Uses `properties.ts`, but ignores Theme entirely. |

### Section: "Border & Shadow"
*Rendered explicitly in `PropertyPanel`.*

| Control UI | Resolution Logic (The "Trail") | Component Default (`properties.ts`) | Status |
| :--- | :--- | :--- | :--- |
| **Border Width** | `props.borderWidth || '0'` | *None* | 🔴 **Hardcoded** |
| **Border Style** | `props.borderStyle || 'solid'` | *None* | 🔴 **Hardcoded** |
| **Border Color** | `props.borderColor || '#e2e8f0'` | *None* | 🔴 **Hardcoded** |
| **Border Radius** | `props.borderRadius || '0'` | `'8'` (Card, Button), `'4'` (Input) | 🔴 **Ignores Default**. Panel shows '0' even for Cards/Buttons! |
| **Shadow** | `props.boxShadow` (No default handled) | `'0 1px 3px...'` (Card) | 🔴 **Ignores Default**. Panel shows 'None' even for Cards! |

### Section: "Layout"
*Rendered explicitly in `PropertyPanel`.*

| Control UI | Resolution Logic (The "Trail") | Component Default (`properties.ts`) | Status |
| :--- | :--- | :--- | :--- |
| **Display** | `props.display || 'block'` | `'flex'` (Container, Card) | 🔴 **Ignores Default**. Panel might show 'Block' for Flex containers. |
| **Flex Dir** | `props.flexDirection || 'row'` | `'column'` (Container, Card) | 🔴 **Ignores Default**. Panel shows 'Row' for Column containers. |
| **Gap** | `props.gap || '0'` | `'16'` (Container) | 🔴 **Ignores Default**. Panel shows '0' for Containers. |

### Section: "HTML Attributes"
*Rendered explicitly.*

| Control UI | Resolution Logic (The "Trail") | Component Default (`properties.ts`) | Status |
| :--- | :--- | :--- | :--- |
| **ID** | `props.htmlId || ''` | *None* | 🔴 **Hardcoded** |
| **Class** | `props.htmlClass || ''` | *None* | 🔴 **Hardcoded** |

---

# Audit Conclusions
1.  **Body Panel is Healthy**: Every property correctly resolves from the theme chain.
2.  **Property Panel is Broken**:
    *   **95% Hardcoded Fallbacks**: Most controls default to empty strings or zeros, completely ignoring the theme.
    *   **Broken Mappings**: Colors look up the wrong theme keys.
    *   **Dead Connections**: Layout/Spacing logic exists but is bypassed.

**Implementation Plan**:
We must replace every instance of `|| 'default'` in **PART 2** with `resolveProperty()`.


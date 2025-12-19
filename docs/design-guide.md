# Application Design Guide & Foundations

This guide explains the architectural philosophy, core systems, and extensibility patterns of the `builderplus` application. It is the starting point for understanding how the application functions and how to contribute to it.

> **Related Documentation**
> *   [SDK Implementation Guide](./sdk-implementation-guide.md) - For copy-pasteable code examples and API specifics.
> *   [Professional Theming Plan](./professional-theming-plan.md) - For deep dives into the 3-Tier Token Architecture.
> *   [Theming Strategy Investigation](./theming-strategy-investigation.md) - For the "Why" behind the decisions.

---

## 1. Core Philosophy
The builder is architected as a **Metadata-Driven Platform**, not just a React App.
*   **Decentralized State**: There is no rigid "Master Switch" for components. Every component is self-contained and registers itself.
*   **Theme-Centric**: Visuals are derived from an active "Theme" rather than hardcoded CSS classes.
*   **Framework Agnostic**: While we use Tailwind for utility, the core system relies on **CSS Variables** and **Style Objects**, making it compatible with any future styling library.

---

## 2. Architecture Overview

### A. The Registry Pattern
The application avoids hard dependencies by using Registries.
1.  **Component Registry**: Stores the `Renderer` (React Component), `Config` (Labels, Icons), and `Defaults` for every draggable item.
2.  **Style Registry**: Defines the "Vocabulary" of the application (e.g., "What is `primaryColor`?"). It is a metadata schema that populates the Theme Panel.
3.  **Theme Registry**: Stores the "Values" (e.g., `primaryColor = #2563eb`). It holds standard themes ('Light', 'Dark') and user-created custom themes.

### B. The 3-Tier Styling System
To ensure professionalism and scalability, we use a tiered token system (detailed in [Theming Strategy](./theming-strategy-investigation.md)).

1.  **Primitives (Palette)**: Raw values like `#2563eb` or `16px`.
2.  **Semantic Tokens (Intent)**: Variables like `--bg-page` or `--action-primary`. These are what components actually *use*.
3.  **Component Tokens**: Specific mappings like `--btn-bg`.

---

## 3. How It Works: The Property Flow

One of the most complex parts of a builder is deciding "What color is this button?". We solve this with a strict **Resolution Hierarchy**.

### The Hierarchy (Generic Property Resolution)
When a component renders or its properties are edited, the system asks these questions in order:

1.  **User Override** (`component.props[key]`): "Did the user explicitly change this specific instance?"
2.  **Component Default** (`defaultProps[key]`): "Does this component type have a factory default (e.g., Button Text)?"
3.  **Theme Value** (`activeTheme[themeKey]`): "Does the active Theme have a global rule for this? (e.g., `buttonPadding`)"
4.  **System Fallback** (`style-properties.ts`): "If all else fails, use the hardcoded safety net."

### key Components
*   **`PropertyPanel.tsx`**: The "Writer". It reads this hierarchy to show the *Effective Value* to the user. If a value is inherited from the Theme, the input shows that inherited value.
*   **`BodyPanel.tsx`**: The "Theme Editor". It allows users to modify the **Theme Values** (Layer 3), which instantly propagates to all components that haven't overridden them.
*   **`resolveProperty.ts`**: The utility function that powers this logic.

---

## 4. Extensibility Guide

The system is designed to be potentially opened to 3rd party developers.

### Adding a New Component
To add a new component (e.g., "Countdown Timer"), you don't edit the core switch statements. You **Register** it.

**Steps:**
1.  **Create Renderer**: A standard React component accepting `props` and `styles`.
2.  **Register**: Use `registerComponent` to define its properties and defaults.
3.  **Theming**: In the registration, map your styles to Theme Keys.

*(See [SDK Implementation Guide](./sdk-implementation-guide.md) for full code examples)*

### Adding a New Style Property
To add a new global design token (e.g., `glassBlur`), you don't edit the Theme Panel UI. You **Register** the field.

**Steps:**
1.  Add to `src/config/style-properties.ts`.
2.  Define its `key`, `label`, `type` (e.g., 'number'), and `group`.
3.  **Result**: It automatically appears in the Theme Panel, runs through the hierarchy, and is accessible to all components.

---

## 5. Best Practices for Contribution

1.  **Never Hardcode Colors**: Always use `styles.primaryColor` or `theme.text`, never `#000` or `text-black`.
2.  **Respect the Registry**: If you need a new property, add it to the Registry so everyone can use it.
3.  **Use `ContainerDroppable`**: For layout components, use the standard droppable zone to ensure drag-and-drop works correctly.

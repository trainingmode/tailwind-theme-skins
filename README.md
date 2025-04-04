# `theme-skins` Pattern for Tailwind

`theme-skins` is a pattern for defining reusable Tailwind themes by "skinning" individual components. This pattern takes advantage of Tailwind v4, such as CSS-first configuration, design tokens exposed as CSS variables, and more.

`theme-skin` Components are built on a simple concept: each component has a **skin**. A **theme** is a collection of **skins**.

- Fully modular
- Strict naming conventions
- Predictable & consistent theming
- Easy to switch themes
- Extensible components–add/override styles in CSS
- Centralized state for skinned properties

**button.tsx**

```tsx
const skin = "bg-(--bg) text-(--text)"

<button
  data-skin="button"
  className={cn("p-1 text-sm", skin)}
>
  Hello!
</button>
```

**light/skin/button.css**

```css
[data-skin="button"] {
  --bg: var(--color-black);
  --text: var(--color-white);

  @variant hover {
    --bg: var(--bg-primary);
  }
}
```

### What is this?

This is a skeleton project outlining the patterns & file structure of the `theme-skins` pattern.

Included are 3 example components–`Button`, `Dropdown`, & `SearchBar`; skinned across 2 themes–`dark` & `light`.

## Button

A simple component with only 2 skinned properties: `bg` & `text`.

Its CSS skin file (`button.css`) defines `@variant` styles for `hover`, `active`, & `disabled` states.

## SearchBar

- Variant skin styles
- Nested descendent skins
- Heroicons

A component with nested descendent elements: an icon and an `<input>` control.

The nested icon defines its own skin `data-skin="searchbar-icon"`. The `input` is target by its semantic tag.

Its CSS skin file recreates the structure of the component. The structure is repeated in `@variant` states. This extra setup ensures accurate debugging of skins.

The component also exposes a `variant` prop (could be any name) to select between different component skins. There are various implementation patterns–this example simply switches the CSS variables applied to the component.

## Dropdown

- Custom `@variant` state
- Complex structure; nested descendent skins
- Dynamic children
- Headless UI (incl. ARIA features)
- Framer Motion
- Heroicons

A component with a complex structure and dynamic children.

A custom `@variant selected` state is defined in the `utils.css` to target the `aria-selected="true"` ARIA attribute.

Like the SearchBar, its CSS skin file recreates the structure of the component.

# Define Themes

Themes reside in separate folders.

Each theme has a single base CSS file. It consists of reusable CSS variables, all skin imports for the theme, and any additional theme style applications (usually applied to the root `html` element).

**themes/dark/dark.css**

```css
[data-theme="dark"] {
  --bg-container: var(--color-black);
  --text-primary: var(--color-white);
  [...]

  @import "./skin/button.css";
  [...]
}

html[data-theme="dark"] {
  @apply bg-(--bg-container) text-(--text-primary);
}
```

Themes are integrated into the root `html` element using the `data-theme` attribute.

```tsx
<html data-theme="dark">...</html>
```

Localized themes are also possible. An app-wide theme must be defined.

# Skin Components

## Core Skinning Techniques

Let's look at a button example.

The `<button>` element will take on a new `data-skin` attribute.

```tsx
<button
  data-skin="button"
  ...
```

Using composable Tailwind `classNames`, a set of base styles & skin styles are defined.

```tsx
<button
  data-skin="button"
  className={cn(baseStyles, skinStyles)}
  ...
```

"Skin styles" define the skinnable styles of the element.

```tsx
const skinStyles = "bg-(--bg) text-(--text)";
```

You'll notice something interesting–the CSS variables are named after the Tailwind properties they link to. This pattern never changes and naming remains the same–no matter the depth of branching for descedents within a component. If a CSS variable will link to Tailwind's `bg`, it will be called `--bg`–same for `text`, `ring`, et al.

The accompanying CSS skin file targets the `data-skin` attribute directly.

```css
[data-skin="button"] {
  --bg: var(--bg-primary);
  --text: var(--text-primary);
}
```

Use the `@variant` directive to skin element states, such as `hover` or `focus`. `@variant` directives are placed inside component skins. In plain English, it could translate to "the hover variant of the target element".

```css
[data-skin="button"] {
  @variant hover {
    --bg: color-mix(in oklab, var(--bg-primary) 85%, transparent);
  }
  @variant active {
    --bg: color-mix(in oklab, var(--bg-primary) 60%, transparent);
  }
  @variant disabled {
    --bg: var(--bg-disabled);
  }
}
```

Notice the original button component _does not contain variant states for skin properties_–only the CSS file defines variants for skin properties.

The original button component would define variants inline for its own base styles, such as scaling the size of the button on hover (e.g. `hover:scale-110`).

## Advanced Skinning Techniques

Consider the following SearchBar component structure snippet.

```tsx
const containerSkin = "bg-(--bg) text-(--text)";
const iconSkin = "text-(--text)";
const inputSkin = "text-(--text) placeholder:text-(--text)";

...

<div
  data-skin="searchbar"
  className={containerSkin}
>
  <svg
    data-skin="searchbar-icon"
    className={iconSkin}
  />
  <input
    className={inputSkin}
  />
</div>
```

The naming convention for skin properties remains identical across all features and descendents–even for pseudo-elements like `placeholder:`. `bg` is always connected to `--bg`. `text` is always connected to `--text`. 0=0. 1=1.

Notice a `data-skin` attribute was also defined for the `<svg>` descendent inside the component. This is recommended for dynamic elements that can change or be swapped in/out for other elements–the attribute will carry between changes. The naming convention for the descendent elements cascades by prefixing each parent-element using - pipe-casing (e.g. `searchbar` -> `searchbar-icon`).

```css
[data-skin="searchbar"] {
  --text: var(--text-primary);

  [data-skin="searchbar-icon"] {
    --text: var(--color-violet-500);
  }

  input {
    --text: var(--text-primary);

    &::placeholder {
      --text: var(--placeholder-primary);
    }
  }

  @variant hover {
    input {
      &::placeholder {
        --text: color-mix(
          in oklab,
          var(--placeholder-primary) 60%,
          transparent
        );
      }
    }
  }
}
```

The above is a snippet of the accompanying CSS skin file for the SearchBar component.

The `data-skin` selector encapsulates all skinned properties for all descendents within the skinned component. The component structure is directly mirrored in the CSS skin file. This is for improved clarity and easy debugging.

Notice the `--text` for the `placeholder` pseudo-element of the `input` element from before. It is contained inside a psuedo-selector `&`, which overrides the variable for the pseudo-element.

The `input` element is selected directly and doesn't define its own skin. This is moreso a design decision where to keep skins uncluttered.

## Custom @variant Selectors

Custom `@variant` selectors can be defined in `utils.css` and used throughout the theme system.

For simple selectors, the shorthand is recommended:

```css
@custom-variant selected (&[aria-selected="true"]);
```

The above defines a new `selected` variant that can be used with the `@variant` directive:

```css
@variant selected {
  --bg: var(--bg-primary);
}
```

The longform is available for variants that require nesting:

```css
@custom-variant selected {
  &:where([aria-selected="true"] *) {
    @slot;
  }
}
```

This keeps themes both readable & easy maintain.

# Theme File Structure

Individual **themes** are contained within separate folders.

Each **theme** contains a single, root CSS file that imports each **skin** for the theme.

**Skins** are contained in the `skin/` folder. Its structure can be flat or branching, as needed.

```
themes/
├── themes.css
├── utils.css
├── dark/
│   ├── dark.css
│   └── skin/
│       ├── button.css
│       ├── dropdown.css
│       └── search.css
└── light/
    ├── light.css
    └── skin/
        ├── button.css
        ├── dropdown.css
        └── search.css
```

The theme system contains a single entry-point `themes.css` file, which imports all themes and any additional utils.

## Solve Single Entry-point Bottleneck Issues with Dynamic Loading

There may come a point during development when theme skins are numerous and complex.

If you experience performance or bottleneck issues when loading the app, you can rewrite the single entry-point `themes.css`. Dynamically load individual theme files on request, rather than loading the entire entry-point at once.

# License

MIT

# Author

Alfred R. Duarte

# TipTap Fluid Typing Extension

A TipTap extension that adds smooth, fluid animations to characters as they are typed in the editor. This extension provides a natural and engaging typing experience by animating each character with customizable easing functions.

## Features

- Smooth character-by-character animation
- Customizable animation duration
- Multiple easing functions available
- TypeScript support
- Zero dependencies (besides TipTap core)

## Installation

```bash
npm install tiptap-extension-fluid-typing

# or with yarn
yarn add tiptap-extension-fluid-typing

# or with pnpm
pnpm add tiptap-extension-fluid-typing
```

## Usage

```typescript
import { Editor } from "@tiptap/core";
import { FluidTyping } from "tiptap-extension-fluid-typing";

const editor = new Editor({
  extensions: [
    // ... other extensions
    FluidTyping.configure({
      // Optional configuration
      animationDuration: 0.2,
      animationEase: "ease-out-cubic",
    }),
  ],
  // ... other options
});
```

## Configuration

The extension accepts the following configuration options:

| Option              | Type     | Default      | Description                          |
| ------------------- | -------- | ------------ | ------------------------------------ |
| `animationDuration` | `number` | `0.2`        | Duration of the animation in seconds |
| `animationEase`     | `string` | `'ease-out'` | Easing function for the animation    |

### Available Easing Functions

- Basic: `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`
- Sine: `ease-in-sine`, `ease-out-sine`, `ease-in-out-sine`
- Quad: `ease-in-quad`, `ease-out-quad`, `ease-in-out-quad`
- Cubic: `ease-in-cubic`, `ease-out-cubic`, `ease-in-out-cubic`
- Quart: `ease-in-quart`, `ease-out-quart`, `ease-in-out-quart`

## Examples

### Basic Usage

```typescript
import { Editor } from "@tiptap/core";
import { FluidTyping } from "tiptap-extension-fluid-typing";

const editor = new Editor({
  extensions: [FluidTyping.configure()],
});
```

### Custom Animation

```typescript
import { Editor } from "@tiptap/core";
import { FluidTyping } from "tiptap-extension-fluid-typing";

const editor = new Editor({
  extensions: [
    FluidTyping.configure({
      animationDuration: 0.15,
      animationEase: "ease-out-cubic",
    }),
  ],
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

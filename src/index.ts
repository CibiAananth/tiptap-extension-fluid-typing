/**
 * TipTap Fluid Typing Extension
 * Adds smooth, fluid animations to characters as they are typed in the editor.
 *
 * @package tiptap-extension-fluid-typing
 * @author Cibi Aananth
 * @license MIT
 */

import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

/**
 * Predefined easing functions for animations.
 * Each easing function provides a different animation curve for character appearance.
 */
const EASING_FUNCTIONS = {
  linear: "linear",
  ease: "ease",
  "ease-in": "ease-in",
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out",
  // Sine easings
  "ease-in-sine": "cubic-bezier(0.47, 0, 0.745, 0.715)",
  "ease-out-sine": "cubic-bezier(0.39, 0.575, 0.565, 1)",
  "ease-in-out-sine": "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
  // Quad easings
  "ease-in-quad": "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
  "ease-out-quad": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  "ease-in-out-quad": "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
  // Cubic easings
  "ease-in-cubic": "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
  "ease-out-cubic": "cubic-bezier(0.215, 0.61, 0.355, 1)",
  "ease-in-out-cubic": "cubic-bezier(0.645, 0.045, 0.355, 1)",
  // Quart easings
  "ease-in-quart": "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
  "ease-out-quart": "cubic-bezier(0.165, 0.84, 0.44, 1)",
  "ease-in-out-quart": "cubic-bezier(0.77, 0, 0.175, 1)",
} as const;

/**
 * Type for available animation easing functions
 */
export type AnimationEase = keyof typeof EASING_FUNCTIONS;

/**
 * Configuration options for the Fluid Typing extension
 */
export type FluidTypingOptions = {
  /**
   * Duration of the animation in seconds
   * @default 0.2
   */
  animationDuration: number;

  /**
   * Easing function for the animation
   * @default "ease-out"
   */
  animationEase: AnimationEase;
};

/**
 * A TipTap extension that adds fluid typing animations to characters
 * as they are typed in the editor.
 *
 * @example
 * ```ts
 * import { FluidTyping } from 'tiptap-extension-fluid-typing'
 *
 * const editor = new Editor({
 *   extensions: [
 *     FluidTyping.configure({
 *       animationDuration: 0.2,
 *       animationEase: 'ease-out-cubic'
 *     })
 *   ]
 * })
 * ```
 */
export const FluidTyping = Extension.create<FluidTypingOptions>({
  name: "fluidTyping",

  addOptions() {
    return {
      animationDuration: 0.2,
      animationEase: "ease-out",
    };
  },

  addProseMirrorPlugins() {
    // Map to track the last content for each node
    const lastContent = new Map<number, string>();
    const pluginKey = new PluginKey("fluidTyping");

    // Create and inject the keyframes style
    const keyframesStyle = document.createElement("style");
    keyframesStyle.textContent = `
      @keyframes fluidTypingFadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(keyframesStyle);

    let decorationSet = DecorationSet.empty;

    // Store options locally to access within plugin scope
    const { animationDuration, animationEase } = this.options;

    return [
      new Plugin({
        key: pluginKey,

        view() {
          return {
            update: (view, prevState) => {
              const { state } = view;

              // Only update if the document has changed
              if (prevState.doc.eq(state.doc)) return;

              decorationSet = DecorationSet.empty;
              const decos: Decoration[] = [];

              // Process each text node in the document
              state.doc.descendants((node, pos) => {
                if (!node.isText || !node.text) return;

                const currentText = node.text;
                const previousText = lastContent.get(pos) || "";

                // Only animate if new text has been added
                if (currentText.length > previousText.length) {
                  const newCharPos = pos + previousText.length;
                  const easingFunction = EASING_FUNCTIONS[animationEase];

                  // Create decoration for the new character
                  decos.push(
                    Decoration.inline(newCharPos, newCharPos + 1, {
                      style: `
                        display: inline-block;
                        animation: fluidTypingFadeIn ${animationDuration}s ${easingFunction} both;
                      `,
                    }),
                  );
                }

                lastContent.set(pos, currentText);
              });

              // Apply decorations if any were created
              if (decos.length) {
                decorationSet = DecorationSet.create(state.doc, decos);
                view.dispatch(
                  view.state.tr.setMeta(pluginKey, { decorationSet }),
                );
              }
            },
          };
        },

        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, oldState) {
            const meta = tr.getMeta(pluginKey);
            if (meta?.decorationSet) {
              return meta.decorationSet;
            }
            if (tr.docChanged) {
              return oldState.map(tr.mapping, tr.doc);
            }
            return oldState;
          },
        },

        props: {
          decorations(state) {
            return this.getState(state);
          },
        },

        destroy() {
          keyframesStyle.remove();
        },
      }),
    ];
  },
});

// Default export for convenience
export default FluidTyping;

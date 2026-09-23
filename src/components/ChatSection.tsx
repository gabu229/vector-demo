"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Mic, ArrowUp } from "lucide-react";
import { RevealText } from "./RevealText";

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

interface ChatTurn {
  id: string;
  question: string;
  answer: string[];
  hasImage?: boolean;
}

const TURNS: ChatTurn[] = [
  {
    id: "turn-1",
    question: "Where am I losing time under braking?",
    answer: [
      "You're losing 0.16–0.21 s in Turn 4. Peak brake pressure is strong, but you begin releasing the pedal 9 m too late, delaying rotation.",
      "Try releasing progressively before turn-in while maintaining initial pressure.",
    ],
  },
  {
    id: "turn-2",
    question: "How can I improve my exit from Turn 9?",
    answer: [
      "Your throttle application begins 0.34 s later than your fastest lap. Rear grip remains stable enough for earlier power.",
      "Begin throttle approximately 6 m earlier and build progressively.",
      "Estimated gain: 0.11 s",
    ],
  },
  {
    id: "turn-3",
    question: "Show me my ride heatmap with analytics and statistics figures",
    answer: [
      "Here's your session heatmap, with braking, speed, and lean-angle data overlaid.",
    ],
    hasImage: true,
  },
];

interface AnalyticsPoint {
  id: string;
  label: string;
  value: string;
  xPercent: number;
  yPercent: number;
}

const ANALYTICS: AnalyticsPoint[] = [
  {
    id: "a1",
    label: "Top speed",
    value: "214 km/h",
    xPercent: 76,
    yPercent: 20,
  },
  {
    id: "a2",
    label: "Avg brake pressure",
    value: "78%",
    xPercent: 14,
    yPercent: 32,
  },
  {
    id: "a3",
    label: "Best sector",
    value: "S2 −0.12 s",
    xPercent: 54,
    yPercent: 70,
  },
  {
    id: "a4",
    label: "Max lean angle",
    value: "52°",
    xPercent: 28,
    yPercent: 80,
  },
  {
    id: "a5",
    label: "Apex speed",
    value: "96 km/h",
    xPercent: 70,
    yPercent: 46,
  },
  { id: "a6", label: "Laps analyzed", value: "14", xPercent: 10, yPercent: 58 },
];

function HeatmapTrack() {
  return (
    <img
      src="/assets/details/race-map.png"
      alt="Ride heatmap showing braking, speed, and lean-angle zones"
      className="h-full w-full rounded-xl object-cover cursor-keep-scrolling-light!"
    />
  );
}

// ---------------------------------------------------------------------------
// Timing & geometry constants
// ---------------------------------------------------------------------------
// Every value that drives the scroll-scrubbed timeline is named here so the
// pacing can be tuned in one place, and so it's clear what each number does.
// None of these are pixel/DOM measurements — the whole point of this pass
// was to remove runtime `getBoundingClientRect()` math, which was going
// stale (see the long comment above the zoom section further down).

/** Extra scrollable distance the pinned section occupies, relative to its
 * own height. The full scripted conversation + zoom sequence plays out over
 * roughly 7.5 viewport-heights of scrolling. */
const SCROLL_DISTANCE = "+=750%";

/** Seconds GSAP's scrub takes to "catch up" to the scrollbar position.
 * Higher = smoother/laggier, lower = snappier/more literal. */
const SCRUB_SMOOTHING_SECONDS = 1;

/** Intro headline fade-out and chat-panel fade/scale-in. Both are pure
 * opacity + transform tweens (no `margin`/`height`), so this step never
 * forces a layout reflow — that was the cause of the panel visibly
 * "shrinking then growing" before settling. */
// const INTRO_TEXT_FADE_DURATION = 0.6;
const PANEL_INTRO_DURATION = 1;

/** Scrubbed "typing time" per word in the fake input: word count * this
 * value, floored so even a two-word question still types out readably. */
const SECONDS_PER_TYPED_WORD = 0.16;
const MIN_TYPING_DURATION = 0.6;

/** How long the caret blinks / the finished question sits in the input
 * before it's cleared and "sent". */
const PRE_SEND_HOLD_DURATION = 0.2;

/** Fade duration for the input caret appearing/disappearing (its blink
 * itself is a real-time CSS animation, not part of this scrubbed value). */
const CARET_FADE_DURATION = 0.15;

/** Zero-duration marker tweens exist only to hang an onStart /
 * onReverseComplete callback at one exact point on the scrubbed timeline —
 * used to flip React state (the recording indicator) or mutate the DOM
 * (clearing the fake input) at the right instant, in either scroll
 * direction. They have no visible motion of their own. */
const MARKER_DURATION = 0.001;

/** User bubble fade/slide-in duration after "send". */
const BUBBLE_REVEAL_DURATION = 0.4;

/** Pause between the user bubble landing and the reply starting to stream,
 * so the reply doesn't feel instantaneous. */
const THINKING_PAUSE_DURATION = 0.2;

/** Assistant bubble container fade/slide-in, before its words stream. */
const ANSWER_BUBBLE_REVEAL_DURATION = 0.35;

/** Per-word reveal duration and stagger for the streamed reply text.
 * Stagger = how much later each word starts revealing than the last. */
const STREAM_WORD_DURATION = 0.55;
const STREAM_WORD_STAGGER = 0.045;

/** Heatmap thumbnail fade/scale-in inside the chat bubble. */
const IMAGE_THUMB_REVEAL_DURATION = 0.5;

/** Pause after a full turn (question + answer) before the next one starts
 * typing. */
const TURN_GAP_DURATION = 0.35;

/** Extra breathing room, in pixels, kept below the newest message when the
 * conversation stack shifts upward — so the latest bubble doesn't sit flush
 * against the bottom edge of the (non-scrollable) message viewport. */
const MESSAGE_BOTTOM_PADDING_PX = 28;

/** Fade duration for the dark scrim behind the zoomed image. */
const SCRIM_FADE_DURATION = 0.5;

/**
 * The heatmap "zoom to fullscreen" step is a pure CSS transform: the overlay
 * is always sized to its final, fullscreen bounds via Tailwind's `inset-*`
 * classes (see JSX below), and we only animate `scale` + opacity on top of
 * that fixed box. We deliberately do NOT compute the zoom "from" position by
 * measuring the thumbnail's live `getBoundingClientRect()`, because:
 *   1. At mount time, the section hasn't been scrolled into its pinned
 *      position yet, so any rect captured then is wrong once the section is
 *      actually pinned at the top of the viewport.
 *   2. The thumbnail itself moves earlier in this same timeline (the
 *      message stack translates upward as each turn reveals), so even a
 *      rect captured "at the right time" would need to be re-measured on
 *      every scrub frame to stay accurate.
 * A transform-only scale animation needs neither, so it can't go stale or
 * end up positioned off-screen — which is what was happening before.
 *
 * OVERLAY_START_SCALE is how small the (already fullscreen-sized) overlay
 * starts before zooming in — small enough to read as "growing out of the
 * chat", not so small it looks like a random dot.
 */
const OVERLAY_START_SCALE = 0.14;
const ZOOM_IN_DURATION = 1.1;
const ZOOM_OUT_DURATION = 1;
const OVERLAY_FADE_DURATION = 0.3;

/** Analytics chip reveal/hide duration and stagger between each chip. */
const ANALYTICS_REVEAL_DURATION = 0.45;
const ANALYTICS_REVEAL_STAGGER = 0.12;
const ANALYTICS_HIDE_DURATION = 0.3;
const ANALYTICS_HIDE_STAGGER = 0.06;

/** How long the analytics stay fully visible before collapsing back down. */
const ANALYTICS_HOLD_DURATION = 1.4;

/** Final pause after everything has closed, before the section unpins. */
const OUTRO_HOLD_DURATION = 0.5;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ChatSection() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const messagesViewportRef = useRef<HTMLDivElement | null>(null);
  const messagesWrapRef = useRef<HTMLDivElement | null>(null);

  const questionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const questionTextRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const answerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const caretRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const imageThumbRef = useRef<HTMLDivElement | null>(null);

  const inputTextRef = useRef<HTMLSpanElement | null>(null);
  const inputCaretRef = useRef<HTMLSpanElement | null>(null);

  const scrimRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const overlayImageRef = useRef<HTMLDivElement | null>(null);
  const analyticsRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [recording, setRecording] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const wrap = messagesWrapRef.current;
      const viewport = messagesViewportRef.current;
      if (!panelRef.current || !wrap || !viewport) return;

      // ---- initial (pre-scroll) states -------------------------------------
      // Everything the timeline will reveal starts hidden here. Bubbles use
      // `autoAlpha` (opacity + visibility) rather than `display:none` so
      // their layout size is measurable up front (see shiftTargets below)
      // even before they're visible.
      gsap.set(panelRef.current, { autoAlpha: 0, y: 24, scale: 0.98 });

      questionRefs.current.forEach(
        (el) => el && gsap.set(el, { autoAlpha: 0, y: 14 }),
      );
      answerRefs.current.forEach(
        (el) => el && gsap.set(el, { autoAlpha: 0, y: 14 }),
      );
      answerRefs.current.forEach((el) => {
        if (!el) return;
        const words = el.querySelectorAll<HTMLSpanElement>("[data-word]");
        gsap.set(words, { autoAlpha: 0 });
      });

      if (imageThumbRef.current) {
        gsap.set(imageThumbRef.current, { autoAlpha: 0, scale: 0.92 });
      }
      caretRefs.current.forEach((el) => el && gsap.set(el, { autoAlpha: 0 }));

      if (scrimRef.current) gsap.set(scrimRef.current, { autoAlpha: 0 });
      if (overlayRef.current) {
        gsap.set(overlayRef.current, {
          autoAlpha: 0,
          scale: OVERLAY_START_SCALE,
        });
      }
      analyticsRefs.current.forEach(
        (el) => el && gsap.set(el, { autoAlpha: 0, scale: 0.85, y: 8 }),
      );

      // ---- precompute the conversation "autoscroll" shift amounts ---------
      // The message viewport is intentionally not scrollable (no scrollbar,
      // no user-driven scroll). Instead, as each bubble is revealed we
      // translate the whole message stack upward so the newest bubble ends
      // up near the bottom of the visible viewport — an autoscroll effect
      // driven entirely by the timeline instead of the browser.
      //
      // This only works because `autoAlpha` hides elements with
      // opacity/visibility, not `display:none` — so every bubble already
      // occupies its final layout position and size from the very first
      // render, even while invisible. That means `offsetTop`/`offsetHeight`
      // (which ignore `transform`, unlike `getBoundingClientRect`) are
      // stable, correct numbers we can compute once, up front, and reuse
      // for the entire scrubbed timeline in both scroll directions.
      const viewportHeight = viewport.clientHeight;
      const revealNodes: Array<HTMLElement | null> = [];
      TURNS.forEach((_, i) => {
        revealNodes.push(questionRefs.current[i]); // even index  -> question bubble
        revealNodes.push(answerRefs.current[i]); //  odd index   -> answer bubble (image, if any, is inside this same node)
      });

      // shiftTargets[n] = how far (px) to translate the stack up so that the
      // bottom edge of revealNodes[n] sits MESSAGE_BOTTOM_PADDING_PX above
      // the bottom of the viewport. Clamped to 0 so early, short turns (that
      // don't yet overflow the viewport) don't pull the stack up early.
      const shiftTargets = revealNodes.map((el) => {
        if (!el) return 0;
        const bottomEdge = el.offsetTop + el.offsetHeight;
        return Math.max(
          0,
          bottomEdge - viewportHeight + MESSAGE_BOTTOM_PADDING_PX,
        );
      });

      // The heatmap image lives inside the turn-3 answer bubble and is
      // already accounted for in that bubble's `offsetHeight` above (it's
      // laid out from the start, just invisible) — so revealing the image
      // later does NOT change the bubble's height and does NOT need its own
      // shift step. (A previous version tried to add one using a fractional
      // array index, e.g. `shiftTargets[i * 2 + 0.5]`, which silently
      // resolved to `undefined` -> animated `y: NaN` -> the stack visibly
      // glitching instead of settling. Removed.)

      // ---- master scroll-driven timeline -----------------------------------
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: SCROLL_DISTANCE,
          scrub: SCRUB_SMOOTHING_SECONDS,
          pin: pinRef.current,
          anticipatePin: 1,
        },
      });

      // Intro: headline fades out, chat panel fades/scales in. Both are
      // opacity + transform only (see constant comment above) — no margin
      // or height animation, so no reflow jank here.
      // tl.to(textRef.current, {
      //   autoAlpha: 0,
      //   duration: INTRO_TEXT_FADE_DURATION,
      // });

      tl.to(
        panelRef.current,
        { autoAlpha: 1, y: 0, scale: 1, duration: PANEL_INTRO_DURATION },
        "<", // start at the same timeline position as the headline fade
      );

      const setRecordingOn = () => setRecording(true);
      const setRecordingOff = () => setRecording(false);

      TURNS.forEach((turn, i) => {
        const words = turn.question.split(" ");
        // A plain numeric proxy object we tween 0 -> words.length; onUpdate
        // reads its interpolated value each frame to decide how many words
        // of the question to show in the fake input. GSAP interpolates this
        // correctly in both scroll directions, so scrubbing backward
        // "un-types" the question smoothly.
        const typeProxy = { i: 0 };

        // Voice/mic button "wakes up" the instant typing begins.
        tl.to(
          {},
          {
            duration: MARKER_DURATION,
            onStart: setRecordingOn,
            onReverseComplete: setRecordingOff,
          },
        );

        // Typewriter effect, word by word, written directly into the fake
        // input's text node.
        tl.to(typeProxy, {
          i: words.length,
          duration: Math.max(
            MIN_TYPING_DURATION,
            words.length * SECONDS_PER_TYPED_WORD,
          ),
          ease: "none",
          onUpdate: () => {
            if (inputTextRef.current) {
              inputTextRef.current.textContent = words
                .slice(0, Math.floor(typeProxy.i))
                .join(" ");
            }
          },
        });

        // Brief hold with a blinking caret, then "send": clear the input,
        // turn the mic off, reveal the user bubble.
        tl.to(
          inputCaretRef.current,
          { autoAlpha: 1, duration: CARET_FADE_DURATION },
          "<",
        );
        tl.to({}, { duration: PRE_SEND_HOLD_DURATION });

        tl.to(
          {},
          {
            duration: MARKER_DURATION,
            onStart: setRecordingOff,
            onReverseComplete: setRecordingOn,
          },
        );
        tl.to(
          {},
          {
            duration: MARKER_DURATION,
            onStart: () => {
              if (inputTextRef.current) inputTextRef.current.textContent = "";
            },
            onReverseComplete: () => {
              if (inputTextRef.current)
                inputTextRef.current.textContent = turn.question;
            },
          },
        );
        tl.to(
          inputCaretRef.current,
          { autoAlpha: 0, duration: CARET_FADE_DURATION },
          "<",
        );

        // Reveal the user bubble and shift the stack up together.
        tl.to(
          questionRefs.current[i],
          { autoAlpha: 1, y: 0, duration: BUBBLE_REVEAL_DURATION },
          "<",
        );
        tl.to(
          wrap,
          { y: -shiftTargets[i * 2], duration: BUBBLE_REVEAL_DURATION },
          "<",
        );

        tl.to({}, { duration: THINKING_PAUSE_DURATION });

        // Streamed reply: bubble fades in (and the stack shifts to its
        // final resting position for this turn — this already accounts for
        // the image, if any, since it's baked into the bubble's height).
        tl.to(answerRefs.current[i], {
          autoAlpha: 1,
          y: 0,
          duration: ANSWER_BUBBLE_REVEAL_DURATION,
        });
        tl.to(
          wrap,
          {
            y: -shiftTargets[i * 2 + 1],
            duration: ANSWER_BUBBLE_REVEAL_DURATION,
          },
          "<",
        );

        const answerWords =
          answerRefs.current[i]?.querySelectorAll<HTMLSpanElement>(
            "[data-word]",
          );
        if (answerWords && answerWords.length > 0) {
          tl.to(caretRefs.current[i], { autoAlpha: 1, duration: 0.1 }, "<");
          tl.to(answerWords, {
            autoAlpha: 1,
            duration: STREAM_WORD_DURATION,
            stagger: STREAM_WORD_STAGGER,
            ease: "none",
          });
          tl.to(caretRefs.current[i], { autoAlpha: 0, duration: 0.1 });
        }

        if (turn.hasImage && imageThumbRef.current) {
          // No accompanying wrap-shift tween here: the bubble's height
          // (and therefore the target computed above) already includes the
          // image's space, so the stack is already at its correct resting
          // position from the tween just above.
          tl.to(imageThumbRef.current, {
            autoAlpha: 1,
            scale: 1,
            duration: IMAGE_THUMB_REVEAL_DURATION,
          });
        }

        tl.to({}, { duration: TURN_GAP_DURATION });
      });

      // ---- zoom the heatmap to fill the section ----------------------------
      // See the OVERLAY_START_SCALE comment above: the overlay box itself is
      // always sized to its final, fullscreen bounds via CSS (`inset-*`
      // classes in the JSX); we only animate `scale` + opacity here, so
      // there's no DOM measurement to go stale.
      if (overlayRef.current) {
        tl.to(scrimRef.current, {
          autoAlpha: 1,
          duration: SCRIM_FADE_DURATION,
        });
        tl.to(
          overlayRef.current,
          {
            autoAlpha: 1,
            scale: 1,
            duration: ZOOM_IN_DURATION,
            ease: "power3.out",
          },
          "<",
        );

        tl.to(analyticsRefs.current, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: ANALYTICS_REVEAL_DURATION,
          stagger: ANALYTICS_REVEAL_STAGGER,
        });

        // Hold so the analytics are readable before collapsing back.
        tl.to({}, { duration: ANALYTICS_HOLD_DURATION });

        tl.to(analyticsRefs.current, {
          autoAlpha: 0,
          scale: 0.85,
          y: 8,
          duration: ANALYTICS_HIDE_DURATION,
          stagger: ANALYTICS_HIDE_STAGGER,
        });

        tl.to(overlayRef.current, {
          scale: OVERLAY_START_SCALE,
          duration: ZOOM_OUT_DURATION,
          ease: "power3.inOut",
        });
        tl.to(
          overlayRef.current,
          { autoAlpha: 0, duration: OVERLAY_FADE_DURATION },
          "-=0.2",
        );
        tl.to(
          scrimRef.current,
          { autoAlpha: 0, duration: OVERLAY_FADE_DURATION },
          "<",
        );
      }

      tl.to({}, { duration: OUTRO_HOLD_DURATION });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative z-20 w-full bg-[#F7F7F4] px-6 text-black! cursor-keep-scrolling-dark!"
    >
      <div
        ref={pinRef}
        className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-14 lg:py-20"
      >
        <div
          ref={textRef}
          className="mb-12 flex flex-col items-center justify-center gap-4 border-b border-line pb-6 text-center"
        >
          <RevealText
            as="h2"
            theme="dark"
            className="font-display text-3xl font-medium sm:text-4xl"
          >
            Ask. Analyse. Go Faster.
          </RevealText>
          <RevealText
            as="p"
            delay={0.2}
            theme="dark"
            className="max-w-2xl font-light"
          >
            Get instant, expert-level answers from your AI race engineer.
            Natural language, real insight, built on your data.
          </RevealText>
        </div>

        {/* Chat panel */}
        <div
          ref={panelRef}
          className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-black/10 cursor-none"
        >
          <div className="flex items-center gap-2 border-b border-black/10 px-5 py-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-black p-1.5">
              <img src="/vector-icon-light.svg" alt="" />
            </span>
            <span className="text-sm font-medium text-black/70">
              AI Engineer
            </span>
          </div>

          {/* Non-scrollable conversation viewport: overflow-hidden clips
              anything past its fixed height, and the visitor never scrolls
              it directly — the timeline moves `messagesWrapRef` instead. */}
          <div
            ref={messagesViewportRef}
            className="relative h-[70vh] overflow-hidden px-5 py-5"
          >
            <div ref={messagesWrapRef} className="flex flex-col gap-4">
              {TURNS.map((turn, i) => (
                <div key={turn.id} className="flex flex-col gap-4">
                  <div
                    ref={(el) => {
                      questionRefs.current[i] = el;
                    }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[80%] rounded-2xl rounded-br-md bg-black px-4 py-3 text-[15px] leading-snug text-white">
                      <span
                        ref={(el) => {
                          questionTextRefs.current[i] = el;
                        }}
                      >
                        {turn.question}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-black p-1.5">
                      <img src="/vector-icon-light.svg" alt="" />
                    </span>
                    <div
                      ref={(el) => {
                        answerRefs.current[i] = el;
                      }}
                      className="max-w-[80%] rounded-2xl rounded-tl-md border border-black/10 px-4 py-3 text-[15px] leading-relaxed text-black/80"
                    >
                      {turn.answer.map((para, pIdx) => (
                        <p key={pIdx} className={pIdx === 0 ? "" : "mt-3"}>
                          {para.split(" ").map((w, wIdx) => (
                            <span
                              key={wIdx}
                              data-word
                              className="mr-[0.28em] inline-block"
                            >
                              {w}
                            </span>
                          ))}
                        </p>
                      ))}
                      <span
                        ref={(el) => {
                          caretRefs.current[i] = el;
                        }}
                        className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-black/50 align-middle"
                      />

                      {turn.hasImage && (
                        <div
                          ref={imageThumbRef}
                          className="mt-3 aspect-[3/2] w-full overflow-hidden rounded-xl border border-black/10 bg-black/10"
                        >
                          <HeatmapTrack />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fake input bar */}
          <div className="flex items-center gap-3 border-t border-black/10 px-4 py-3">
            <div className="flex-1 truncate text-[15px] text-black/80">
              <span className="mr-1 text-orange-500/70">|</span>
              <span ref={inputTextRef} />
              <span
                ref={inputCaretRef}
                className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-black/60 align-middle"
              />
            </div>

            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black/60">
              {recording && (
                <>
                  <span className="absolute inset-0 animate-ping rounded-full bg-orange-400/40" />
                  <span className="absolute -inset-1 animate-ping rounded-full bg-orange-400/20 [animation-delay:150ms]" />
                </>
              )}
              <Mic className="relative h-4 w-4" />
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white">
              <ArrowUp className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Fullscreen zoom scrim + overlay. Both are viewport-relative
            (`fixed inset-*`) via pure CSS — no JS measurement — and only
            ever animate opacity/scale, so their size and position are
            correct at every scrub position, including before the section
            has finished being scrolled into its pinned spot. */}
        <div
          ref={scrimRef}
          className="pointer-events-none cursor-keep-scrolling-light! fixed inset-0 z-40 bg-[#F7F7F4]/70 backdrop-blur-lg"
        />
        <div
          ref={overlayRef}
          className="pointer-events-none cursor-keep-scrolling-light! fixed inset-6 z-50 overflow-hidden rounded-2xl border-4 border-black bg-[#050505] md:inset-12"
        >
          <div
            ref={overlayImageRef}
            className="absolute inset-0 cursor-keep-scrolling-light!"
          >
            <HeatmapTrack />
          </div>
          {ANALYTICS.map((point, i) => (
            <div
              key={point.id}
              ref={(el) => {
                analyticsRefs.current[i] = el;
              }}
              className="absolute cursor-keep-scrolling-light! -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/15 bg-black/70 px-3 py-2 text-left backdrop-blur-sm"
              style={{ left: `${point.xPercent}%`, top: `${point.yPercent}%` }}
            >
              <div className="text-[11px] uppercase tracking-wide text-white/50">
                {point.label}
              </div>
              <div className="text-2xl font-heading font-semibold text-white">
                {point.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { EventEmitter } from "eventemitter3";
import { Easing, EasingFunction, EasingFunctionName } from "./easing";

export class Tween extends EventEmitter<
  "start" | "update" | "complete" | "stop"
> {
  private startTime: number;
  private from: number;
  private to: number;
  private easingFn: EasingFunction;
  durationMs: number;

  constructor(durationMs: number) {
    super();
    this.durationMs = durationMs;
    this.startTime = -1;
    this.from = 0;
    this.to = 0;
    this.easingFn = Easing["easeOutQuad"];
  }

  get isRunning() {
    return this.startTime !== -1;
  }

  start(
    from: number,
    to: number,
    easeingFn: EasingFunctionName = "easeOutQuad"
  ): Promise<void> {
    if (this.isRunning) {
      this.stop();
    }

    this.from = from;
    this.to = to;
    this.startTime = Date.now();
    this.easingFn = Easing[easeingFn];
    this.emit("start", from, to, easeingFn);
    this.tick();

    return new Promise((resolve) => {
      const onComplete = () => {
        this.off("complete", onComplete);
        resolve(void 0);
      };

      this.on("complete", onComplete);
    });
  }

  stop() {
    this.startTime = -1;
    this.emit("stop");
  }

  private tick = () => {
    const { startTime, from, to, durationMs, easingFn } = this;

    if (startTime === -1) {
      return;
    }

    const lerp = Math.min(1, (Date.now() - startTime) / durationMs);
    const parametric = easingFn(lerp);
    const value = from + (to - from) * parametric;

    this.emit("update", value);

    if (lerp === 1) {
      this.stop();
      this.emit("complete");
    } else {
      requestAnimationFrame(this.tick);
    }
  };
}

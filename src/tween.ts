import { EventEmitter } from "eventemitter3";
import { Easing, EasingFunction, EasingFunctionName } from "./easing";

export const _requestAnimationFrame = (fn: () => void) => {
  if (typeof requestAnimationFrame === "undefined") {
    setTimeout(fn, 0);
  } else {
    requestAnimationFrame(fn);
  }
};

export class Tween extends EventEmitter<
  "start" | "update" | "complete" | "stop"
> {
  private _startTime: number;
  private _from: number;
  private _to: number;
  private _currentValue: number;
  private _easingFn: EasingFunction;

  public duration: number;

  public static defaultDurationMs: number = 150;

  static run(
    updateFn: (value: number) => void,
    from: number,
    to: number,
    durationMs: number = Tween.defaultDurationMs,
    easeingFn: EasingFunctionName = "easeOutQuad"
  ) {
    return new Tween(durationMs)
      .on("update", updateFn)
      .start(from, to, easeingFn);
  }

  constructor(durationMs: number = Tween.defaultDurationMs) {
    super();

    this.duration = durationMs;
    this._startTime = -1;
    this._from = 0;
    this._to = 0;
    this._currentValue = 0;
    this._easingFn = Easing["easeOutQuad"];
  }

  get isRunning() {
    return this._startTime !== -1;
  }

  get currentValue() {
    return this._currentValue;
  }

  start(
    from: number,
    to: number,
    easeingFn: EasingFunctionName = "easeOutQuad"
  ): Promise<void> {
    if (this.isRunning) {
      this.stop();
    }

    this._from = from;
    this._to = to;
    this._startTime = Date.now();
    this._currentValue = from;
    this._easingFn = Easing[easeingFn];
    this.emit("start", from, to);
    this.tick();

    return new Promise((resolve) => {
      const onComplete = () => {
        this.off("complete", onComplete);
        resolve(void 0);
      };

      this.on("stop", onComplete).on("complete", onComplete);
    });
  }

  stop() {
    this._startTime = -1;
    this.emit("stop", this.currentValue);
  }

  private tick = () => {
    const { _startTime, _from, _to, duration, _easingFn } = this;

    if (_startTime === -1) {
      return;
    }

    const lerp = Math.min(1, (Date.now() - _startTime) / duration);
    const parametric = _easingFn(lerp);
    const value = (this._currentValue = _from + (_to - _from) * parametric);

    this.emit("update", value);

    if (lerp === 1) {
      this._startTime = -1;
      this.emit("complete", _from, _to);
    } else {
      _requestAnimationFrame(this.tick);
    }
  };
}

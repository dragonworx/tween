import { Tween } from "../src";

Tween.defaultDurationMs = 50;

describe("Tween", () => {
  it("should interpolate values over time & fire update and complete", (done) => {
    const values: Array<number> = [];
    const tween = new Tween();
    tween
      .on("update", (value) => {
        values.push(value);
      })
      .on("complete", () => {
        const sorted = [...values];
        sorted.sort();
        expect(tween.currentValue).toBe(1);
        expect(values.length).toBeGreaterThan(3);
        expect(Math.round(values[0])).toBe(0);
        expect(values[values.length - 1]).toBe(1);
        expect(values).toEqual(sorted);
        expect(tween.isRunning).toBeFalsy();
        done();
      })
      .start(0, 1, "linear");
  });

  it("should interpolate in descending order", (done) => {
    const values: Array<number> = [];
    const tween = new Tween();
    tween
      .on("update", (value) => {
        values.push(value);
      })
      .on("complete", () => {
        const sorted = [...values];
        sorted.sort();
        sorted.reverse();
        expect(tween.currentValue).toBe(0);
        expect(values.length).toBeGreaterThan(3);
        expect(Math.round(values[0])).toBe(1);
        expect(values[values.length - 1]).toBe(0);
        expect(values).toEqual(sorted);
        done();
      })
      .start(1, 0, "linear");
  });

  it("should not be running until started", () => {
    const tween = new Tween();
    expect(tween.isRunning).toBeFalsy();
    expect(tween.currentValue).toBe(0);
  });

  it("should stop if running and re-started", (done) => {
    const events: Array<string> = [];
    const tween = new Tween();
    tween
      .on("start", () => events.push(`start@${Math.round(tween.currentValue)}`))
      .on("stop", () => events.push(`stop@${Math.round(tween.currentValue)}`))
      .on("complete", () => {
        events.push(`complete@${Math.round(tween.currentValue)}`);
        expect(events).toEqual(["start@0", "stop@0", "start@1", "complete@2"]);
        done();
      });
    tween.start(0, 1);
    tween.start(1, 2);
  });

  it("should provide promise using static function", (done) => {
    const values = [];
    Tween.run((value) => values.push(value), 0, 1).then(() => {
      expect(values.length > 0);
      done();
    });
  });

  it("should provide from/to values with start and complete", (done) => {
    const tween = new Tween();
    const onStart = jest.fn();
    const onStop = jest.fn();
    const onComplete = jest.fn();
    tween.on("start", onStart).on("stop", onStop).on("complete", onComplete);
    tween.start(0, 1).then(() => {
      expect(onStart).toHaveBeenCalledWith(0, 1);
      expect(onStop).not.toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalledWith(0, 1);
      done();
    });
  });

  it("should provide currentValue with stop event", (done) => {
    const tween = new Tween(1000);
    const onStop = jest.fn();
    const onComplete = jest.fn();
    tween.on("stop", onStop).on("complete", onComplete);
    tween.start(0, 1).then(() => {
      expect(onStop).toHaveBeenCalledWith(tween.currentValue);
      expect(onComplete).not.toHaveBeenCalled();
      done();
    });
    tween.stop();
  });

  it("should provide shortcut for binding stop event", (done) => {
    const tween = new Tween(1000);
    const onStop = jest.fn();
    tween.onStop(onStop);
    tween.start(0, 1).then(() => {
      expect(onStop).toHaveBeenCalled();
      done();
    });
    tween.stop();
  });

  it("should provide shortcuts to bind events", (done) => {
    const tween = new Tween(0);
    const onStart = jest.fn();
    const onUpdate = jest.fn();
    const onComplete = jest.fn();
    tween.onStart(onStart);
    tween.onUpdate(onUpdate);
    tween.onComplete(onComplete);
    tween.start(0, 1).then(() => {
      expect(onStart).toHaveBeenCalled();
      expect(onUpdate).toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalled();
      done();
    });
  });
});

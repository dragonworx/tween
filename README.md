# Tween

A simple tweening library based on [EventEmitter3](https://www.npmjs.com/package/eventemitter3).

> Works in the Browser or NodeJS

## Install

Install as dependency through npm.

`npm install tween`

## Usage

Create a new `Tween` object passing the desired duration in milliseconds.

```javascript
import { Tween } from "tween";

const tween = new Tween(1000); // 1 second
```

The `Tween` object will emit these events:

- `start` - `(fromValue: number, toValue: number, easingFunctionName: string)` When started
- `update` - `(currentValue: number)` While animating **(This is the main event you should subscribe to)**
- `complete` - `(void)` When completed (duration has expired)
- `stop` - `(void)` When stopped

For example, let's create a `Tween` which runs for 1 second and blends from the value `10` to `20`. First we subscribe to the `update` event, then we call `.start(fromValue, toValue, [easingFunction])`.

```javascript
/* listen for updates */
tween.on("update", (value) => {
  /* "value" will be between 10 -> 20 based on current time and easing function */
  myThing.theProp = value;
});

/* know when done */
tween.on("complete", () => {
  /* we're done */
});

/* start the animation, get a promise to know when done (or use `complete` event) */
tween.start(10, 20).then(() => {
  /* we're done */
});

/* or using async style to await */
await tween.start(10, 20);
```

We can start the same tween with different from/to values by calling `.start()` again whenever required. Calling `.start()` on a `Tween` will stop any currently running animating. This keeps each individual `Tween` focussed on a single animation at a given time.

We can also modify the `.durationMs` property to change the duration (note this needs to be done before running an animation).

```javascript
tween.durationMs = 2500; // 2.5 seconds
```

If we need to stop the `Tween` while it's animating we can call `.stop()`.

```javascript
tween.stop();
```

We can also check if the `Tween` is running with `.isRunning`.

```javascript
if (tween.isRunning) {
  /* wait, or stop it, or abort whatever we were going to do */
}
```

## Easing Function

The `.start(fromValue, toValue, [easingFunction])` method takes an optional 3rd parameter which is the name of the easing function (`easeOutQuad` is the default). The following easing functions are available (see [https://easings.net](https://easings.net) for more information):

- `linear`
- `easeInSine`
- `easeOutSine`
- `easeInOutSine`
- `easeInQuad`
- `easeOutQuad` _(default)_
- `easeInOutQuad`
- `easeInCubic`
- `easeOutCubic`
- `easeInOutCubic`
- `easeInQuart`
- `easeOutQuart`
- `easeInOutQuart`
- `easeInQuint`
- `easeOutQuint`
- `easeInOutQuint`
- `easeInExpo`
- `easeOutExpo`
- `easeInOutExpo`
- `easeInCirc`
- `easeOutCirc`
- `easeInOutCirc`
- `easeInBack`
- `easeOutBack`
- `easeInOutBack`
- `easeInElastic`
- `easeOutElastic`
- `easeInOutElastic`
- `easeInBounce`
- `easeOutBounce`
- `easeInOutBounce`

# Issues

Please report any issues, feedback, bugs or suggestions [here](https://github.com/dragonworx/file-format/issues).

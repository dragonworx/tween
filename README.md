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

The `Tween` will fire these events:

- `start` - When started
- `update` - While animating - **This is the main event you would want to use**
- `complete` - When completed (duration has expired)
- `stop` - When stopped

For example, let's create a `Tween` which runs for 1 second and blends from the value `10` to `20`. First we subscribe to the `update` event, then we call `.start(fromValue, toValue, [easingFunction])`.

```javascript
tween.on("update", (value) => {
  // value will be between 10 -> 20 based on current time and easing curve...
  myThing.theProp = value;
});

tween.start(10, 20).then(() => {
  // done
});

// or async
await tween.start(10, 20);
```

We could also have subscribed to the `complete` event to know when done.

```javascript
tween.on("complete", () => {
  // done
});
```

If we need to stop the `Tween` while it's animating, just call `.stop()`.

```javascript
tween.stop();
```

We can also check if the `Tween` is running with `.isRunning`.

```javascript
if (tween.isRunning) {
  // wait, or stop it, or abort whatever we were going to do
}
```

Calling `.start()` on a `Tween` will stop any currently running animating. This keeps each individual `Tween` focussed on a single animation at a given time.

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

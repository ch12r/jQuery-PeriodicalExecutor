jQuery-PeriodicalExecutor
=========================

Dependencies: 

* Class.js, By John Resig http://ejohn.org/ (licensed under MIT)
* jQuery

Usage:

```javascript
var periodicalExecutor = new PeriodicalExecutor({
  delay: 10, // 10ms between execution
  autoStart: false, // autostart?
  execFunction: callback, // callback function
  once: false // execute only once?
});
periodicalExecutor.start(); // Starts periodical execution of callback
periodicalExecutor.stop(); // Stops execution
```

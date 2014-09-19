/**
 * PeriodicalExecutor executes a callback function (args.execFunction) in a periodical manner
 * using a delay (args.delay).
 *
 * Possible parameters:
 *  - args.delay: time in milliseconds
 *  - args.execFunction: callback
 *  - args.once: execute PE only once
 *  - args.autoStart: Should PE be executed directly after instantiation
 *
 * Methods for public use:
 *  - start: Starts the periodical execution (be aware of args.once!)
 *  - stop: Stops the periodical execution
 *
 * Changes:
 *  - Using semaphore for avoiding start/stop-interferences
 *
 * @author Christian Renner, info@christian-renner.
 * @copyright: Christian Renner, info@christian-renner.eu, 2012.
 *
 * Version: 0.9.1
 * Date: 10.10.12
 * Time: 18:29
 *
 * MIT Licensed.
 */

var PeriodicalExecutor = Class.extend({
    init: function(args)
    {
        this.running = false;
        this.semaphore = false;
        var date = new Date();
        var now = date.getTime() / 1000;
        this.id = 'id-'+now;
        this.args = args;
        this.validArgs = this.validateArgs();
        if (this.validArgs) {
            if (this.args.autoStart == true) {
                this.running = true;
                this.run();
            }
        }
    },
    run: function()
    {
        var me = this;
        if (this.running == true) {
            this.semaphore = true;
            if (this.args.delay > 1000) {
                var runThis = true,
                    steps = 10,
                    delayParticle = this.args.delay/steps;
                var callback = function() {
                    jQuery({}).queue(function() {
                        if (runThis == true && me.running == true) {
                            me.args.execFunction.call();
                        }
                        jQuery(this).dequeue();
                    }).queue(function() {
                            if (runThis == true && me.args.once == false && me.running == true) {
                                me.run();
                            }
                            jQuery(this).dequeue();
                        });
                };
                var tmpDelay = 0;
                for (var i = 1; i <= steps; i++) {
                    var tmpCallback = null;
                    if (i == steps) {
                        tmpCallback = callback;
                    }
                    tmpDelay += delayParticle;
                    runThis = me.subRoutine(runThis, tmpDelay, tmpCallback);
                }
            } else {
                me.realRun();
            }
        }
    },
    subRoutine: function(runThis, delay, callback)
    {
        var me = this;
        jQuery({}).delay(delay).queue(function() {
            if (me.running == false) {
                runThis = false;
            }
            if (callback) {
                me.semaphore = false;
            }
            if (callback
                && runThis == true
                && me.running == true) {
                callback.call();
            }
            jQuery(this).dequeue();
        });
        return runThis;
    },
    realRun: function() {
        var me = this;
        jQuery({}).delay(this.args.delay).queue(function() {
            if (me.running == true) {
                me.args.execFunction.call();
            }
            me.semaphore = false;
            jQuery(this).dequeue();
        }).queue(function() {
                if (me.args.once == false
                    && me.running == true) {
                    me.run();
                }
                jQuery(this).dequeue();
            });
    },
    start: function()
    {
        if (this.running == false
            && this.semaphore == false) {
            this.running = true;
            this.run();
        } else if (this.semaphore == true) {
            this.running = true;
        }
    },
    stop: function()
    {
        this.running = false;
    },
    validateArgs: function()
    {
        if ('delay' in this.args
            && this.args.delay > 0
            && 'execFunction' in this.args
            && 'autoStart' in this.args
            && 'once' in this.args) {
            return true;
        }
        return false;
    }
});

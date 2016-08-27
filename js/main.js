/**
 * Created by Nitesh_Kumar_Anand on 8/21/2016.
 */
(function() {
    var recognition, final_transcript = '', callback, catchCallback;
    function beginListening() {
        console.log('I am listening now');
        recognition.start();
    }
    function stopListening() {
        recognition.stop();
    }
    function initialize() {
        if (!('webkitSpeechRecognition' in window)) {
            catchCallback = catchCallback || function() {console.warn('No error handler provided');};
            catchCallback('webkit speech recoginition not found');
        } else {
            recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.onerror = function(event) {
                console.log('Error listening');
                stopListening();
            };
            recognition.onresult = function(event) {
                callback = callback || function () {console.warn('no callback found');};
                var interim_transcript = '';
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final_transcript = event.results[i][0].transcript;
                        callback(final_transcript);
                        final_transcript = '';
                    }
                }
            };
            recognition.onend = function() {
                console.log('Ending but I will auto re-start');
                beginListening();
            };
            beginListening();
        }
        return {
            then: function(cb) {
                callback = cb;
            },
            catch: function() {

            }
        }
    }

    window.ASR = {
        initialize: initialize
    };
}());

(function () {
    var ready = false, timer;

    function readyToAcceptCommand() {
        ready = true;
        if(timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            ready = false;
            $('#uhoh').get(0).play();
            console.log('Going back for hot keyword detection');
        }, 5 * 1000);
        console.log('Giving you 15 seconds to speak command');
    }

    function doStuff(text) {
        if(/gorgeous/i.test(text) && !ready) {
            $('#yes').get(0).play();
            if(!Commands.execute(text)) {
                readyToAcceptCommand();
                console.log('Play, I am ready to listen for next 15 seconds');
            }
        }
        else if(ready) {
            console.log('I am supposed to :: ', text);
            Commands.execute(text);
            readyToAcceptCommand();
        }else {
            console.log('ignoring', text);
        }
    }

    ASR.initialize().then(doStuff);
}());
(function () {
    var services = [];
    function parseAndExecute(text) {
        var handlerFound = false;
        var executor;
        $(services).each(function (i, service) {
            var command = service.parse(text);
            if(!handlerFound && command) {
                // found handler
                executor = command;
                handlerFound = true;
            }
        });
        if(!handlerFound) {
            console.log('No one handles this action');
            return undefined;
        }else {
            return executor.action ? executor.action(executor) : (function (doer) {
                console.log('Doer does not do specified action', doer);
            }(executor));
        }
    }
    var commands = {
        execute: function (text) {
            console.log('Executing', text);
            return parseAndExecute(text);
        },
        addService: function (service) {
            services.push(service);
        }
    };
    window.Commands = commands;
}());
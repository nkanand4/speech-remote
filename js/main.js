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
            recognition.continuous = true;
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
                        final_transcript += event.results[i][0].transcript;
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

function doStuff(text) {
    console.log(text);
}

ASR.initialize().then(doStuff);
/**
 * Created by nitesh on 8/27/16.
 */

(function () {
    var kodi = 'http://192.168.1.66:8080';
    $.ajaxSetup({
        cache: true
    });
    function parseTime(text) {
        var hours = 0, minutes = 0, seconds = 0;
        var matchTimings = text.match(/[0-9]+\s[a-z]+/ig);
        $(matchTimings).each(function (i, match) {
            if(/hour/.test(match)) {
                hours = match.replace(/hours?/i, '');
            }
            if(/minute/.test(match)) {
                minutes = match.replace(/minutes?/i, '');
            }
            if(/second/.test(match)) {
                seconds = match.replace(/seconds?/i, '');
            }
        });
        return {
            hours: parseInt(hours, 10),
            minutes: parseInt(minutes, 10),
            seconds: parseInt(seconds, 10)
        };
    }
    function uriEncodeSendData(data) {
        var string = JSON.stringify(data);
        string = encodeURIComponent(string);
        return string;
    }
    function sendRequest(params) {
        var action = encodeURIComponent(JSON.stringify(params));
        $.getScript('http://localhost:12480/xbmc/perform/'+action);
    }
    var apis = {
        parse: function (text) {
            var response, time;
            if(/kodi|movie|xbmc/ig.test(text)) {
                response = {};
                response.original = text;
                if(/play|pause|hold/i.test(text)) {
                    response.action = apis.play;
                }else if(/rewind|back/ig.test(text)) {
                    response.action = function (command) {
                        var rewindBy = 0;
                        time = parseTime(command.original);
                        rewindBy += parseInt(time.hours, 10) * 60 * 60;
                        rewindBy += parseInt(time.minutes, 10) * 60;
                        rewindBy += parseInt(time.seconds, 10);
                        apis.rewind(rewindBy);
                    }
                }else if(/jump|seek/ig.test(text)) {
                    time = parseTime(text);
                    response.action = function () {
                        apis.jump(time);
                    }
                }else if(/stop/ig.test(text)) {
                    response.action = apis.stop;
                }else if(/home/ig.test(text)) {
                    response.action = apis.home;
                }else if(/select/i.test(text)) {
                    response.action = function () {
                        apis.input('Select');
                    };
                }else if(/navigate/i.test(text)) {
                    if(/\sdown/i.test(text)) {
                        response.action = function () {
                            apis.input('Down');
                        };
                    }else if(/\sup/i.test(text)) {
                        response.action = function () {
                            apis.input('Up');
                        };
                    }else if(/\sright|write/ig.test(text)) {
                        response.action = function () {
                            apis.input('Right');
                        };
                    }else if(/\sleft/i.test(text)) {
                        response.action = function () {
                            apis.input('Left');
                        };
                    }
                }
            }
            return response;
        },
        play: function (command) {
            sendRequest({
                api: 'Player.PlayPause'
            });
            return true;
        },
        rewind: function (duration) {
            console.log('rewind by', duration);
            return true;
        },
        stop: function () {
            sendRequest({
                api: 'Player.Stop'
            });
            return true;
        },
        home: function () {
            sendRequest({
                api: 'Input.Home'
            });
            return true;
        },
        input: function (action) {
            sendRequest({
                api: 'Input.'+action
            });
            return true;
        },
        jump: function (time) {
            sendRequest({
                api: 'Player.Seek',
                hours: time.hours,
                minutes: time.minutes,
                seconds: time.seconds
            });
            return true;
        }
    };
    Commands.addService(apis);
}());
/**
 * Created by nitesh on 8/27/16.
 */

(function () {
    var kodi = 'http://192.168.1.66:8080';
    $.ajaxSetup({
        cache: true
    });
    var apis = {
        parse: function (text) {
            var response;
            if(/kodi|movie|xbmc/g.test(text)) {
                response = {};
                response.original = text;
                if(/play|pause|hold/i.test(text)) {
                    response.action = apis.play;
                }else if(/rewind|back/ig) {
                    response.action = function (command) {
                        var matchTimings = command.original.match(/[0-9]+\s[a-z]+/ig);
                        var rewindBy = 0, hours = 0, minutes = 0, seconds = 0;
                        $(matchTimings).each(function (i, match) {
                            if(/hour/.test(match)) {
                                hours = match.replace(/hours?/i, '');
                                hours = parseInt(hours, 10) * 60 * 60;
                            }
                            if(/minute/.test(match)) {
                                minutes = match.replace(/minutes?/i, '');
                                minutes = parseInt(minutes, 10) * 60;
                            }
                            if(/second/.test(match)) {
                                seconds = match.replace(/seconds?/i, '');
                                seconds = parseInt(seconds, 10);
                            }
                            rewindBy = hours + minutes + seconds
                        });
                        apis.rewind(rewindBy);
                    }
                }else if(/jump|seek/ig) {

                }
            }
            return response;
        },
        play: function (command) {
            $.getScript('http://localhost:12480/xbmc/perform/%7B%22api%22%3A%22Player.PlayPause%22%7D');
            return true;
        },
        rewind: function (duration) {
            console.log('rewind by', duration);
        }
    };
    Commands.addService(apis);
}());
/**
 * Created by nitesh on 8/27/16.
 */
(function () {
    $.ajaxSetup({
        cache: true
    });
    var lightController = {
        parse: function (text) {
            var response;
            if(/light/i.test(text)) {
                response = {};
                response.original = text;
                response.action = lightController.toggle;
                response.state = /\son/i.test(text) ? 'on' : 'off';
            }
            return response;
        },
        toggle: function (command) {
            $.getScript('http://192.168.1.73:12480/api/togglelight/'+command.state);
            return true;
        }
    };
    Commands.addService(lightController);
}());
/**
 * Created by nitesh on 8/27/16.
 */
(function () {
    $.ajaxSetup({
        cache: true
    });
    var apis = {
        parse: function (text) {
            var response;
            if(/garage\sdoor/i.test(text)) {
                response = {};
                response.original = text;
                response.action = apis.toggle;
            }
            return response;
        },
        toggle: function (command) {
            $.getScript('http://192.168.1.73:12480/api/toggledoor');
            return true;
        }
    };
    Commands.addService(apis);
}());
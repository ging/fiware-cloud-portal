function loadTemplates(urls, callback) {
    var total = urls.length;
    var amount = 0;
    var success = function (response) {
        $('head').append(response);
        amount++;
        if (amount === total) {
            callback();
        }
    };
    for (var index in urls) {
        var url = urls[index];
        $.ajax({url: url + "?random=" + Math.random()*99999,
            asynx: false, // synchonous call in case code tries to use template before it's loaded
            success: success
        });
    }
}
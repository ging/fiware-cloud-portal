var VNCView = Backbone.View.extend({

    _template: _.itemplate($('#vncTemplate').html()),

    events: {
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close',
        'click #full-screen-button': 'onFullScreen',
        'keydown': 'onKey'
    },

    initialize: function () {
        $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', this.onFullScreenChanged);
    },

    close: function (e) {
        $('#vnc-temp').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function() {
        $(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange', this.onFullScreenChanged);
        this.undelegateEvents();
        this.unbind();
    },

    onKey: function (e) {
        if(e.which === 27) {
            this.close();
        }
    },

    onFullScreen: function () {
        var elem = document.getElementById('vnc-screen');

        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else {
          return;
        }

    },

    onFullScreenChanged: function (e) {
        
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

        if (fullscreenElement === null) {

            // When closing full-screen mode
            $('#vnc-screen').css('width', '');
            $('#vnc-screen').css('max-height', '');
            $('#vnc-iframe').css('height', '420px');

        } else {

            // When starting full-screen mode
            $('#vnc-screen').css('max-height', '100000000px');
            $('#vnc-screen').css('height', '98%');
            $('#vnc-screen').css('width', '98%');
            var h = screen.availHeight - 60;
            $('#vnc-iframe').css('height', h + 'px');

        }
    },

    render: function () {
        if ($('#vnc-temp').html() != null) {
            $('#vnc-temp').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({vncUrl: this.options.vncUrl}));
        $('.modal:last').modal({keyboard: false});

        return this;
    }
});
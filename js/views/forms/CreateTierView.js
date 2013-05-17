var CreateTierView = Backbone.View.extend({

    _template: _.itemplate($('#createTierFormTemplate').html()),

    dial: undefined,

    events: {
        'submit #form': 'onCreate',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close',
        'change .tier-values': 'onInput'
    },

    initialize: function() {
        this.options = this.options || {};
        this.options.roles = new Roles();
        this.options.roles.fetch();
    },

    close: function(e) {
        $('#create_tier').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    onInput: function() {
        var min = $('#tier-min-value').val();
        var max = $('#tier-max-value').val();
        var dial = this.dial[0];

        dial.o.min = parseInt(min);
        dial.o.max = parseInt(max);
        if (dial.v > dial.o.max) {
            dial.v = dial.o.max;
        } else if (dial.v < dial.o.min) {
            dial.v = dial.o.min;
        }
        console.log(min, max, dial.v);
        dial._draw();
    },

    render: function () {
        if ($('#create_tier').html() != null) {
            $('#create_tier').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        this.dial = $(".dial-form").knob();
        return this;
    },

    onCreate: function(e){
        var self = this;
        e.preventDefault();
        var name = this.$('input[name=name]').val();
        var descr = this.$('textarea[name=description]').val();
        var callbacks = UTILS.Messages.getCallbacks("Tier "+name + " created.", "Error creating tier "+name);
    }
});
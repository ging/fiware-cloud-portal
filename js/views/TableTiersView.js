var TableTiersView = Backbone.View.extend({

    _template: _.itemplate($('#tableTiersTemplate').html()),

    cid: undefined,

    initialize: function() {
        // main_buttons: [{label:label, url: #url, action: action_name}]
        // dropdown_buttons: [{label:label, action: action_name}]
        // headers: [{name:name, tooltip: "tooltip", size:"15%", hidden_phone: true, hidden_tablet:false}]
        // entries: [{id:id, cells: [{value: value, link: link}] }]
        // onAction: function() {}
        this.cid = Math.round(Math.random() * 1000000);
        var events = {};
        events['click .btn-main-' + this.cid] = 'onMainAction';
        events['click .fi-icon-actions-' + this.cid] = 'onIconAction';
        this.delegateEvents(events);
        this.options.disableContextMenu = true;
    },

    getEntries: function() {
        var self = this;
        return this.options.getEntries.call(this.options.context);
    },

    getHeaders: function() {
        return this.options.getHeaders.call(this.options.context);
    },

    getDropdownButtons: function() {
        return this.options.getDropdownButtons.call(this.options.context);
    },

    getMainButtons: function() {
        return this.options.getMainButtons.call(this.options.context);
    },

    getActionButtons: function() {
        if (this.options.getActionButtons) {
            return this.options.getActionButtons.call(this.options.context);
        } else {
            return [];
        }
    },

    onAction: function(action, entries) {
        entries.forEach(function(entry) {
            entry.id = entry.id;
        });
        return this.options.onAction.call(this.options.context, action, entries);
    },

    onClose: function() {
        this.undelegateEvents();
        this.unbind();
    },

    onIconAction: function(evt) {
        var btn_idx = $(evt.target)[0].id.split("_" + this.cid)[0];
        var btn = this.getActionButtons()[btn_idx];
        var entry = $(evt.target).parent().parent().parent()[0].id.split("entries__row__")[1];
        var entries = [entry];
        this.onAction(btn.action, entries);
    },

    onMainAction: function(evt) {
        var btn_idx = $(evt.target)[0].id.split("_" + this.cid)[0];
        var btn = this.getMainButtons()[btn_idx];
        var entries = [];
        this.onAction(btn.action, entries);
    },

    render: function() {
        var entries = this.getEntries();
        var new_template = this._template({
            cid: this.cid,
            main_buttons: this.getMainButtons(),
            actions: this.getActionButtons(),
            headers: this.getHeaders(),
            entries: entries,
            color: this.options.color,
            color2: this.options.color2,
            dropdown_buttons_class: this.options.dropdown_buttons_class
        });

        var scrollTo = 0;
        if ($('.scrollable_' + this.cid).data('tsb')) {
            scrollTo = $('.scrollable_' + this.cid).data('tsb').getScroll();
            $('.scrollable_' + this.cid).data('tsb').stop();
        }
        $(this.el).html(new_template);
        $(".dial").knob();
        $('.scrollable_' + this.cid).tinyscrollbar({offsetTop: 0, offsetBottom: 0, scrollTo: scrollTo});
        return this;
    }
});
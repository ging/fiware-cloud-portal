var EditProjectView = Backbone.View.extend({

    _template: _.itemplate($('#editProjectFormTemplate').html()),

    events: {
        'click .update-project': 'onUpdate',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    close: function(e) {
        $('#edit_project').remove();
        $('.edit-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#edit_project').html() != null) {
            $('#edit_project').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },

    onUpdate: function(e){
        var name = this.$('input[name=name]').val();
        var descr = this.$('textarea[name=description]').val();
        var enabled = this.$('input[name=enabled]').is(':checked');
        this.model.set({'name': name});
        this.model.set({'description': descr});
        this.model.set({'enabled': enabled});
        this.model.save();
        subview = new MessagesView({el: '#content', state: "Success", title: "Project "+this.model.get('name')+" updated."});
        subview.render();
    }

});
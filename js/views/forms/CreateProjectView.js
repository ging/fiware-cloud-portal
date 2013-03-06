var CreateProjectView = Backbone.View.extend({

    _template: _.itemplate($('#createProjectFormTemplate').html()),

    events: {
        'submit #form': 'onCreate',
        'click #cancelBtn': 'close',
        'click #close': 'close',
        'click .modal-backdrop': 'close'
    },

    close: function(e) {
        $('#create_project').remove();
        $('.modal-backdrop').remove();
        this.onClose();
    },

    onClose: function () {
        this.undelegateEvents();
        this.unbind();
    },

    render: function () {
        if ($('#create_project').html() != null) {
            $('#create_project').remove();
            $('.modal-backdrop').remove();
        }
        $(this.el).append(this._template({model:this.model}));
        $('.modal:last').modal();
        return this;
    },

    onCreate: function(e){
        e.preventDefault();
        var name = this.$('input[name=name]').val();
        var descr = this.$('textarea[name=description]').val();
        var enabled = this.$('input[name=enabled]').is(':checked');
        var project = new Project();
        project.set({'name': name});
        project.set({'description': descr});
        project.set({'enabled': enabled});
        project.save();
        subview = new MessagesView({el: '#content', state: "Success", title: "Project "+project.get('name')+" created."});
        subview.render();
        this.close();
    }

});
var ModifyUsersView = Backbone.View.extend({

    _template: _.itemplate($('#modifyUsersTemplate').html()),

    usersForProjectView: undefined,
    newUsersView: undefined,

    initialize: function() {
        this.render();
       	this.usersForProjectView = new UsersForProjectView({model: this.model, el: '#users_for_project'});
        this.newUsersView = new NewUsersView({model: this.model, el: '#add_new_users'});
    },


    close: function(e) {
       // this.options.usersModel.unbind("change", this.render, this);
        this.model.unbind("change", this.render, this);
        $('#users_for_project').remove();
        $('#new_add_users').remove();
        this.undelegateEvents();
        this.unbind();
    },

    onClose: function() {
        this.usersForProjectView.close();
        this.newUsersViewView.close();
        this.undelegateEvents();
        this.unbind();
    },
    
    render: function() {
        var self = this;
        UTILS.Render.animateRender(this.el, this._template);
        

    }
    
});
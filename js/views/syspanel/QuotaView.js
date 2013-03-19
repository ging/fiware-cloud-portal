var QuotaView = Backbone.View.extend({

    _template: _.itemplate($('#quotasTemplate').html()),

    initialize: function() {
       this.model.unbind("reset");
       this.model.bind("reset", this.rerender, this);
       this.model.fetch();
    },

    onClose: function() {
      this.undelegateEvents();
      this.unbind();
      this.model.unbind("reset");
    },

    close: function() {
      console.log("Closing");
      this.onClose();
    },

     rerender: function() {
      var self = this;
      console.log("Rerendering");
      //UTILS.Render.animateRender(this.el, this._template, {models:this.model.models});
      $(this.el).empty().html(this._template({models: this.model.models}));
    },

    render: function() {
      var self = this;
      console.log("Rendering");

      UTILS.Render.animateRender(this.el, this._template, {models: this.model.models});
    }
  });
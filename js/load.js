$(document).ready(function(){

    UTILS.Auth.initialize("http://mcu5.dit.upm.es:5000/v2.0/");

    var fiRouter = new OSRouter();

    Backbone.history.start();

});
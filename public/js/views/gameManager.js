define([
    'backbone',
    'tmpl!templates/mainMenu',
    'tmpl!templates/hs',
    'tmpl!templates/cred',
    'tmpl!templates/game',
    'tmpl!templates/set',
    'game'
], function (
    Backbone,
    mainMenuTmpl,
    hsTmpl,
    credTmpl,
    gameTmpl,
    setTmpl,
    game
) {
    return Backbone.View.extend({

        //capture keyboard input
        initialize: function () {
        //     _.bindAll(this, 'keyInput');
        //     $(document).bind('keydown', this.keyInput);
            game.init();
        },
        scores: undefined,

        events: {
            'click .game': 'startGame',
            'click .hs': 'highScores',
            'click .cred': 'credits',
            'click .exit': 'exit',
            'click .set': 'settings',
            'click .back': 'back'
        },

        startGame: function(){
            this.$el.html(gameTmpl());
            game.start();
        },

        highScores: function(){
            this.$el.html(hsTmpl(this.scores));
        },

        settings: function(){
            this.$el.html(setTmpl());
        },

        credits: function(){
            this.$el.html(credTmpl());
        },

        exit: function(){
            window.open('', '_self', '');
            window.close();
        },

        back: function(){
            this.$el.html(mainMenuTmpl());
        },

        render: function () {
            this.$el.html(mainMenuTmpl());
            var that = this;
            $.get('/getScores', function(data){
                that.scores = data;
            });
            return this;
        }
    });
});

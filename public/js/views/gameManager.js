define([
    'backbone',
    'tmpl!templates/mainMenu',
    'tmpl!templates/hs',
    'tmpl!templates/cred',
    'tmpl!templates/game',
    'tmpl!templates/set',
    'lib/howler',
    'game'
], function (
    Backbone,
    mainMenuTmpl,
    hsTmpl,
    credTmpl,
    gameTmpl,
    setTmpl,
    howler,
    game
) {
    return Backbone.View.extend({

        //capture keyboard input
        initialize: function () {
        //     _.bindAll(this, 'keyInput');
        //     $(document).bind('keydown', this.keyInput);
            game.init({});
        },

        scores:  undefined,
        sound:   undefined,
        fx:      undefined,
        music:   "On",
        effects: "On",

        events: {
            'click .game': 'startGame',
            'click .hs': 'highScores',
            'click .cred': 'credits',
            'click .exit': 'exit',
            'click .set': 'settings',
            'click .back': 'back',
            'click .music': 'toggleMusic',
            'click .effects': 'toggleFX',
            'click .button': 'makeClickSound'
        },

        startGame: function(){
            this.$el.html(gameTmpl());
            $('#game').css('display', 'block');
            game.start();
        },

        highScores: function(){
            this.$el.html(hsTmpl(this.scores));
        },

        settings: function(){
            this.$el.html(setTmpl({music:this.music, effects:this.effects}));
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

        toggleMusic: function(){
            if(this.music == "On"){
                this.sound.pause();
                this.music = "Off";
                $('.music').html("Music Off");
            }
            else{
                this.sound.play();
                this.music = "On";
                $('.music').html("Music On");
            }
        },

        toggleFX: function(){
            if(this.effects == "On"){
                this.effects = "Off";
                $('.effects').html("Sound Effects Off");
            }
            else{
                this.effects = "On";
                $('.effects').html("Sound Effects On");
            }
        },

        makeClickSound: function(){
            if(this.effects == "On")
                this.fx.play();
        },

        bindSound: function(){
            this.sound = new Howl({urls: ['./snd/tron.mp3'],loop: true}).play();
            this.fx = new Howl({urls: ['./snd/click.mp3']});
        },

        render: function () {
            this.$el.html(mainMenuTmpl());
            this.bindSound();
            var that = this;
            $.get('/getScores', function(data){
                that.scores = data;
            });
            return this;
        }
    });
});

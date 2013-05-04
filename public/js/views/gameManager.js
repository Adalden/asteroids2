define([
    'backbone',
    'tmpl!templates/mainMenu',
    'tmpl!templates/hs',
    'tmpl!templates/cred',
    'tmpl!templates/game',
    'tmpl!templates/set',
    'tmpl!templates/gSound',
    'tmpl!templates/inGame',
    'game/highScores',
    'game'
], function (
    Backbone,
    mainMenuTmpl,
    hsTmpl,
    credTmpl,
    gameTmpl,
    setTmpl,
    gSoundTmpl,
    gSettingsTmpl,
    hsManager,
    game
) {
    return Backbone.View.extend({

        //capture keyboard input
        initialize: function () {
        },

        initGame: function () {
            game.init({});
        },

        scores:  undefined,
        sound:   undefined,
        fx:      undefined,
        music:   "Off",
        effects: "On",
        p1Controls: [38, 37, 39, 32],
        p2Controls: [87, 65, 68, 70],
        arrows: ['Uarrow', 'Larrow', 'Rarrow', 'Darrow', 'Space'],
        ctrlChange: undefined,
        resetGame: undefined,

        events: {
            'click .game': 'showOptions',
            'click .hs': 'highScores',
            'click .cred': 'credits',
            'click .exit': 'exit',
            'click .set': 'settings',
            'click .back': 'back',
            'click .music': 'toggleMusic',
            'click .effects': 'toggleFX',
            'click .button': 'makeClickSound',
            'click .controls': 'changeInput',
            'click .gBack': 'gameBack',
            'click .gSounds': 'gameSound',
            'click .resume': 'resumeGame',
            'click .sBack': 'settingsBack',
            'click .pCount': 'startGame',
            'click .saveHS': 'saveHS'
        },

        startGame: function(e){
            if(this.resetGame){
                console.log("test");
                this.initGame();
                this.resetGame = false;
                game.resume();
            }
            var option = parseInt(e.target.className.split(' ')[1]);
            this.$el.html(gameTmpl());
            $('#game').css('display', 'block');
            game.start(option, this.p1Controls, this.p2Controls);
        },

        showOptions: function(){
            $('.playerCountOverlay').css('display', 'block');
        },

        highScores: function(){
            this.$el.html(hsTmpl(this.scores));
        },

        setModels: function (models) {
            game.setModels(models);
        },

        settings: function(){
            this.$el.html(setTmpl({music:this.music, effects:this.effects}));
            var classArray = ['.u', '.l', '.r', '.f'];
            for(var n = 0; n < this.p1Controls.length; ++n){
                //p1Controls
                if(this.p1Controls[n] >= 37 && this.p1Controls[n] <= 40 || this.p1Controls[n] == 32)
                    $('.p1'+classArray[n]).html(this.fromChar(this.p1Controls[n]));
                else
                    $('.p1'+classArray[n]).html(String.fromCharCode(this.p1Controls[n]));

                //p2Controls
                if(this.p2Controls[n] >= 37 && this.p2Controls[n] <= 40 || this.p2Controls[n] == 32)
                    $('.p2'+classArray[n]).html(this.fromChar(this.p2Controls[n]));
                else
                    $('.p2'+classArray[n]).html(String.fromCharCode(this.p2Controls[n]));
            }

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
                game.setFX(false);
            }
            else{
                this.effects = "On";
                $('.effects').html("Sound Effects On");
                game.setFX(false);
            }
        },

        makeClickSound: function(){
            if(this.effects == "On")
                this.fx.play();
        },

        bindSound: function(){
            this.sound = new Howl({ urls: ['./snd/tron.mp3'], loop: true, volume: .1 });
            this.fx = new Howl({urls: ['./snd/click.mp3']});
            if(this.music == "On")
                this.sound.play();
        },

        fromChar: function(code){
            if(code == 38)
                return "Uarrow";
            if(code == 37)
                return "Larrow";
            if(code == 39)
                return "Rarrow";
            if(code == 40)
                return "Barrow";
            if(code == 32)
                return "Space";

            return "Unknown Key";
        },

        changeInput: function(event){
            var that = this;
            $(document).bind('keydown.controls',function(e){
                that.getInput(e, event.target.className);
            });
            $('.settingsWrapper').css('opacity', '.2');
            $('.popup').css({visibility: "visible", opacity: "1"});
        },

        getInput: function(e, str){
            var newKey = e.keyCode;
            $(document).unbind('keydown.controls');
            $('.popup').css('visibility', 'hidden');
            $('.settingsWrapper').css('opacity', '1');
            if(newKey != 27){
                $(this.parseClass(str, newKey)).html(String.fromCharCode(newKey));
            }
        },

        parseClass: function(str, newKey){
            var temp = str.split(' ');
            var newStr = "";
            for(var n = 0; n < temp.length; ++n)
                newStr += '.'+ temp[n];
            if(temp[1] == 'p1')
                this.updateControls(this.p1Controls, temp[2], newKey);
            if(temp[1] == 'p2')
                this.updateControls(this.p2Controls, temp[2], newKey);
            return newStr;
        },

        updateControls: function(thisControlSet, thisControl, newKey){
            if(thisControl == 'u')
                thisControlSet[0] = newKey;
            if(thisControl == 'l')
                thisControlSet[1] = newKey;
            if(thisControl == 'r')
                thisControlSet[2] = newKey;
            if(thisControl == 'f')
                thisControlSet[3] = newKey;
        },

        gameBack: function(){
            location.reload(true);
        },

        gameSound: function(){
            $('.ingameOptions').html(gSoundTmpl({music: this.music, effects: this.effects}));
        },

        resumeGame: function(){
            $('.ingameOptionsOverlay').css('display', 'none');
            $('#game').css('opacity', '1');
            game.resume();
        },

        settingsBack: function(){
            $('.ingameOptions').html(gSettingsTmpl());
        },

        saveHS: function(){
            hsManager.init(this.scores);
            var name = $('.name').val();
            var score = parseInt($('.newHS').html());
            hsManager.save(name, score);
            this.scores = hsManager.get();
            $.post('/saveScores', {scores: this.scores}, function(data){console.log(data);location.reload(true)});
        },

        render: function () {
            this.$el.html(mainMenuTmpl());
            this.bindSound();
            var that = this;
            $.get('/getScores', function(data){
                that.scores = data;
                hsManager.init(that.scores);
            });
            return this;
        }
    });
});

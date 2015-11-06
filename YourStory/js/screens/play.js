game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // reset the score
        game.data.score = 0;
		//load a level
		var story=game.data.story_count;
		var level=game.data.level_count;
		var area=game.data.level[game.data.story_count][level]["intro"];
		//var area=game.data.level[story][level]["intro"];
		me.levelDirector.loadLevel(area);

        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
		me.audio.playTrack("sweden");
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
		me.audio.stopTrack();
    }
});

/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init: function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        this.body.setVelocity(26, 30);


        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.alwaysUpdate = true;

        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("walk", [0, 1, 2, 3, 4, 5]);
        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand", [0]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
		



    },

    /**
     * update the entity
     */
    update: function(dt) {

        if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            this.renderable.flipX(true);
            // update the entity velocity
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.renderable.flipX(false);
            // update the entity velocity
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }

        } else {
            this.body.vel.x = 0;
            // change to the standing animation
            this.renderable.setCurrentAnimation("stand");
        }
        if (me.input.isKeyPressed('jump')) {
            // make sure we are not already jumping or falling
            if (!this.body.jumping && !this.body.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.vel.y = -(this.body.maxVel.y * me.timer.tick) / 2;
                // set the jumping flag
                this.body.jumping = true;
            }
        }
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision: function(response, other) {
        switch (other.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                // Simulate a platform object
                if (other.type === "platform") {
                    if (this.body.falling &&
                        !me.input.isKeyPressed("down") &&
                        // Shortest overlap would move the player upward
                        (response.overlapV.y > 0) &&
                        // The velocity is reasonably fast enough to have penetrated to the overlap depth
                        (~~this.body.vel.y >= ~~response.overlapV.y)
                    ) {
                        // Disable collision on the x axis
                        response.overlapV.x = 0;

                        // Repond to the platform (it is solid)
                        return true;
                    }
                    // Do not respond to the platform (pass through)
                    return false;
                }

                //TEST
                //return true;


                break;

            case me.collision.types.ENEMY_OBJECT:

                // a regular moving enemy entity
                if ((response.overlapV.y > 0) && this.body.falling) {
                    // jump
                    //find out which story level I am on
                    game.data.score = 0;
                    var story_count = game.data.story_count;

                    //find out which level the game is at
                    var level = game.data.level_count;

                    //find out which sublevel the game is at

                    var sub_level = game.data.sub_l_count;
                    s_len = game.data.level[story_count][level].length;



                    //we need to make sure that if sub_level count+1> number of levels,
                    //that we then restart our sublevel count
                    if (s_len <= sub_level + 1) {
                        game.data.sub_l_count = 0;
                        sub_level = 0;
                    } else {
                        game.data.sub_l_count += 1;
                        sub_level = game.data.sub_l_count;
                    }
                    game.data.in_box = false;


                    area = game.data.level[story_count][level][sub_level]
                    me.levelDirector.loadLevel(area);
                    me.game.viewport.fadeOut("#000000", 250);
                }

                // Not solid
                return false;

                break;

            case me.collision.types.ACTION_OBJECT:

                if ((response.overlapV.y > 0) && this.body.falling && other.type=="tramp") {
					

                    this.body.vel.y -= this.body.maxVel.y * me.timer.tick;


                    //this.body.vel.y-=this.body.maxVel.y*me.timer.tick;
                } else if(other.type=="box"){
                    response.overlapV.x = 0;
                    response.overlapV.y = 0;
                    //put the collected items in the box
                    if (me.input.isKeyPressed("put")) {
                        game.data.in_box = true;
						//Make the image change.
						me.game.world.removeChild(other);
						
						//PlaySounds

                    }
                }

                break;

            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }

        // Make the object solid
        return true;
    }
});

game.CoinEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
        // call the parent constructor
        this._super(me.CollectableEntity, 'init', [x, y, settings]);
    },
    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision: function(response, other) {
        // do something when collected
        // make sure it cannot be collected "again"
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        // remove it
        game.data.score += 1;
        me.game.world.removeChild(this);
        return false
    }
});


/* --------------------------
an enemy Entity
------------------------ */
game.EnemyEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        //ettings.image = "Boy";

        // save the area size defined in Tiled
        var width = settings.width;
        var height = settings.height;

        // adjust the size setting information to match the sprite size
        // so that the entity object is created with the right size
        settings.framewidth = settings.width = 32;
        settings.frameheight = settings.height = 32;

        // redefine the default shape (used to define path) with a shape matching the renderable
        settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);

        // call the parent constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        // set start/end position based on the initial area size
        /*x = this.pos.x;
        this.startX = x;
        this.endX = x + width - settings.framewidth
        this.pos.x = x + width - settings.framewidth;
		*/
        // to remember which side we were walking
        this.walkLeft = false;

        // walking & jumping speed
        //this.body.setVelocity(4, 6); 

    },

    // manage the enemy movement
    update: function(dt) {

        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            // make it walk
            this.renderable.flipX(this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;

        } else {
            this.body.vel.x = 0;
        }

        // update the body movement
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision: function(response, other) {
        if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
            // res.y >0 means touched by something on the bottom
            // which mean at top position for this one

            return false;




        }
        // Make all other objects solid
        return true;
    }
});

game.LevelChangeEntity = me.LevelEntity.extend({
    init: function(x, y, settings) {
        this._super(me.LevelEntity, 'init', [x, y, settings]);
        this.settings = settings;
    },
	
	onCollision: function(){
	if (game.data.in_box == true) {
            game.data.total_score += game.data.score;
			game.data.in_box = false;
            game.data.score = 0;
            game.data.sub_l_count = 0;
            game.data.level_count += 1;
            game.data.story_count += this.s_plus;
            lev = game.data.level[game.data.story_count][game.data.level_count][game.data.sub_l_count]
            me.levelDirector.loadLevel(lev);
            me.game.viewport.fadeOut(this.fade, this.duration);

        } 
	}

    //onFadeComplete: function() {


		
		 /**    game.data.total_score += game.data.score;
            game.data.score = 0;
            game.data.sub_l_count = 0;
            game.data.level_count += 1;
            game.data.story_count += this.s_plus;
            lev = game.data.level[game.data.story_count][game.data.level_count][game.data.sub_l_count]
            me.levelDirector.loadLevel(lev);
            me.game.viewport.fadeOut(this.fade, this.duration); **/
 

        //Would only increment the story if I have copmleted all levesl in the story
        //see if I need to increment the story_count

		//


    //}

});

game.TrampEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.LevelEntity, 'init', [x, y, settings]);
        this.settings = settings;
        this.body.collisionType = me.collision.types.ACTION_OBJECT;
    }
});


game.BoxEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.LevelEntity, 'init', [x, y, settings]);
        this.settings = settings;
        this.body.collisionType = me.collision.types.ACTION_OBJECT;
	//	this.renderable.addAnimation("empty",[0]);
	//	this.renderable.addAnimation("full",[1]);
		
	//	this.renderablel.setCurrentAnimation("empty");
    }
});
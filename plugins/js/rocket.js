/* 
 * Copyright (C) 2015 Tom Lindley <tom a t tlkr dot co dot uk>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var WUC = window.WUC || {};

WUC._modules.rocket = function() {
    
    var self = this;
    
    this.enableGravity = true;

    this.target = $('.WUCRocket');
    this.targetHeight = this.target.height();
    this.targetWidth = this.target.width();
    this.windowHeight = null;
    this.windowWidth = null;
    this.targetFire = null;
    this.targetFirePreload;
    this.body = $('body');
    this.firing = false;
    this.position = {top: (this.body.height() / 2), left: (this.body.width() / 2)};
    this.momentum = {top: 0, left: 0};
    this.rotation = 0;
    this.maximumRotationRate = 1;
    this.rotationRate = this.maximumRotationRate;
    this.rotationDirection = 'right';
    this.fireInterval = null;
    this.rotateInterval = null;
    this.movementInterval = null;
    this.gravityInterval = null;
    this.acceleration = 0.05;
    this.touchingGround = false;
    this.frictionSlowRate = 0.05;
    this.groundTop = this.body.height() - this.target.height();
    this.positionMap = [];
    this.collisionFrames = 5;
    this.lastCollisionCheckPosition = {top: 0, left: 0};
    this.lastPositionMap = [];

    this.start = function() {
        if (!this.target.length) { return false; }

        WUC.settings.setSetting('rocket', 'acceleration', this.acceleration);
        //WUC.settings.setSetting('builder', 'height', this.defaultHeight);
        //WUC.settings.setSetting('builder', 'image', 'running.gif');
        WUC.Core.addCSS('plugins/css/rocket.css');
        
        this.targetFirePreload = new Image();
        this.targetFirePreload.src = 'rocketfire.png';
        
        this.setupSubscribers();
        this.setupRocket();
        this.setupEvents();
        this.startRocket();
    };
    
    this.makeCollisionMap = function() {
        this.lastPositionMap = this.positionMap;
        this.positionMap = [];
        WUC.container.find('img, h1').not('.WUCRocket').each(function(i, element) {
            var _element = $(element);
            var offset = _element.offset();

            var width = _element.outerWidth();
            var height = _element.outerHeight();
            // _element.css('border', 'solid 1px #000');
            self.positionMap.push({
                x: offset.left,
                y: offset.top,
                x2: offset.left + width,
                y2: offset.top + height,
                w: width,
                h: height
            });
        });
    };
    
    this.bounceX = function(dampen) {
        dampen = (dampen === undefined) ? 1 : dampen;
        this.momentum.left = (this.momentum.left * -1) * dampen;
    };
    
    this.bounceY = function(dampen) {
        dampen = (dampen === undefined) ? 1 : dampen;
        this.momentum.top = (this.momentum.top * -1) * dampen;
    };
    
    this.checkCollision = function() {
        this.makeCollisionMap();
        var target = {
            x: this.position.left,
            x2: this.position.left + this.targetWidth,
            y: this.position.top,
            y2: this.position.top + this.targetHeight
        };
        $.each(this.positionMap, function(i, object) {
            if (target.x < object.x2 &&
                target.x2 > object.x &&
                target.y < object.y2 &&
                target.y2 > object.y) {
            
                var _bounced = false;
           
                //from the left
                if (self.lastCollisionCheckPosition.left + self.targetWidth < object.x && target.x2 >= object.x) {
                    console.log('from the left');
                    _bounced = true;
                    self.bounceX();
                } else if (self.lastCollisionCheckPosition.left >= object.x2 && target.x < object.x2) { //or from the right
                    console.log('from the right');
                    _bounced = true;
                    self.bounceX();
                }
                
                //from the top
                if (self.lastCollisionCheckPosition.top + self.targetHeight < object.y && target.y2 >= object.y) {
                    console.log('from the top');
                    _bounced = true;
                    self.bounceY();
                } else if (self.lastCollisionCheckPosition.top >= object.y2 && target.y < object.y2) { //or from the bottom
                    console.log('from the bottom');
                    _bounced = true;
                    self.bounceY();
                }
                
                if (_bounced == false) { //hit by a moving object
                    if (self.lastPositionMap[i] !== undefined) {
                        var oldObject = self.lastPositionMap[i];
                        if (oldObject.y > object.y) { //it's moving up
                            self.momentum.top -= 5;
                        } else if (oldObject.y < object.y) { //it's moving down
                            self.momentum.top += 5;
                        }
                        
                        if (oldObject.x > object.x) { //it's moving left
                            self.momentum.left -= 5;
                        } else if (oldObject.x < object.x) { //it's moving right
                            self.momentum.left += 5;
                        }
                    }
                    console.log('did not bounce');
                }
            }
        });
        self.lastCollisionCheckPosition.top = target.y;
        self.lastCollisionCheckPosition.left = target.x;
    };
    
    this.startRocket = function() {
        var collisionLoops = 0;
         this.movementInterval = setInterval(function() {
             
             collisionLoops++;
             
             if (self.touchingGround) {
                 var slowRate = (((self.frictionSlowRate * (Math.abs(self.momentum.left) / 2)) < self.frictionSlowRate) ? self.frictionSlowRate : (self.frictionSlowRate * (Math.abs(self.momentum.left) / 2)));
                 if (Math.abs(self.momentum.left) - slowRate < 0) {
                     self.momentum.left = 0;
                     
                    //rotate back to upwards
                    if (self.rotation > 180) { //rotate clockwise
                        self.rotateBy(self.rotation);
                    } else { //rotate anticlockwise
                        self.rotateBy(-(self.rotation));
                    }
                     
                 } else {
                    self.rotateBy((self.momentum.left < 0 ? -4 : 4));  //roll
                    if (self.momentum.left < 0) {
                        self.momentum.left += slowRate;
                    } else {
                        self.momentum.left -= slowRate;
                    }
                }
             }
            self.updatePosition(-(self.momentum.top), self.momentum.left);
            
            if (collisionLoops === self.collisionFrames) {
                collisionLoops = 0;
                self.checkCollision();
            }
            
        }, 10);
        if (this.enableGravity) {
            this.gravityInterval = setInterval(function() {
                self.momentum.top -= 0.1;
            }, 30);
        }
    };
    
    this.getWindowHeight = function() {
        return $(window).height();
    };
    
    this.getWindowWidth = function() {
        return $(window).width();
    };
    
    this.setupRocket = function() {
        this.target.css('position', 'absolute');
        this.targetFire = this.target.clone().attr('src', 'rocketfire.png').insertAfter(this.target);
        this.fire(false);
        this.moveTo(this.position.top, this.position.left);
    };
    
    this.rotateBy = function(change) {
        this.rotation = ((this.rotation + change) % 360);
        this.target.add(this.targetFire).css('transform', 'rotate('+this.rotation.toString()+'deg)');
    };
    
    this.updatePosition = function(addTop, addLeft) {
        this.position.top += addTop;
        this.position.left += addLeft;
        if (this.position.top >= this.groundTop) { //we hit the ground
            this.position.top = this.groundTop;
            self.bounceY(0.4);
            this.touchingGround = true;
        } else {
            this.touchingGround = false;
        }
        if (this.position.left > this.windowWidth) {
            this.position.left = -this.targetWidth;
        }
        if (this.position.left < -(this.targetWidth)) {
            this.position.left = this.windowWidth;
        }
        this.moveTo(this.position.top, this.position.left);
    };
    
    this.moveTo = function(top, left) {
        var target = this.target;
        if (this.firing) {
            target = target.add(this.targetFire);
        } else {
            this.targetFire.css('top', '-100px');
        }
        target.css('top', top.toString() + 'px').css('left', left.toString() + 'px');
    };
    
    this.rotate = function(enabled, direction) {
        if (this.rotationDirection !== direction) {
            this.rotationDirection = direction;
            this.rotate(false); //disable it so we can restart it
        }
        
        if (enabled) {
            if (this.rotateInterval === null) {
                this.rotateInterval = setInterval(function() {
                    self.rotateBy((direction === 'left' ? -(self.rotationRate) : self.rotationRate));
                }, 10);
            }
        } else {
            if (this.rotateInterval !== null) {
                window.clearInterval(this.rotateInterval);
                this.rotateInterval = null;
            }
        }
            
    };
    
    this.shoot = function() {
        
        //calculate rotated top/left
        //var rotatedLeft = (this.position.left + this.targetWidth / 2) + ((this.targetHeight * Math.cos( (self.rotation * (Math.PI / 180) ) )) / 2);
        //var rotatedTop = (this.position.top + this.targetHeight / 2) + ((this.targetHeight * Math.sin( (self.rotation * (Math.PI / 180) ) )) / 2);
        
        var bullet = $('<div>')
            .css('width', '1px')
            .css('height', '10px')
            .css('border', 'solid 1px #000')
            .css('transform', 'rotate(' + this.rotation + 'deg)')
            .css('position', 'absolute')
            .css('top', this.position.top)
            .css('left', this.position.left);
    
    
        var topChange = self.getTopChange(5);
        var leftChange = self.getLeftChange(5);
        var _bulletInterval =  setInterval(function() {
            var newTop = (parseFloat(bullet.css('top')) - topChange);
            var newLeft = (parseFloat(bullet.css('left')) + leftChange);
            
            if (newTop + 10 > self.windowHeight || newLeft + 10 > self.windowWidth || newLeft < 0 || newTop < 0) {
                bullet.remove();
                window.clearInterval(_bulletInterval);
            }
            
            bullet.css('top', newTop + 'px');
            bullet.css('left', newLeft + 'px');
            
        }, 10);
    
        WUC.container.append(bullet);
    };
    
    this.fire = function(enabled) {
        this.target.css('display', (enabled ? 'none' : 'block'));
        
        this.firing = enabled;
        
        if (enabled) {
            if (this.fireInterval === null) {
               this.fireInterval = setInterval(function() {
                    var topChange = self.getTopChange();
                    var leftChange = self.getLeftChange();
                        if ((self.rotation > 90 && self.rotation < 270) && self.rotation > 270) {
                            self.momentum.top -= topChange;
                        } else {
                            self.momentum.top += topChange;
                        }
                        if (self.rotation > 180) {
                            self.momentum.left = parseFloat(self.momentum.left - leftChange);
                        } else {
                            self.momentum.left = parseFloat(self.momentum.left + leftChange);
                            
                        }
               }, 10);
            }
        } else {
            //this.target.attr('src', 'rocket.png');
            if (this.fireInterval !== null) {
                window.clearInterval(this.fireInterval);
                this.fireInterval = null;
            }
        }
        
    };
    
    this.getTopChange = function(accelerationOverride) {
        var acceleration = (accelerationOverride === undefined) ? self.acceleration : accelerationOverride;
        return parseFloat((Math.cos(self.rotation * (Math.PI / 180)) * parseFloat(acceleration)).toFixed(2));
    };
    
    this.getLeftChange = function(accelerationOverride) {
        var acceleration = (accelerationOverride === undefined) ? self.acceleration : accelerationOverride;
        return parseFloat((Math.sin(self.rotation * (Math.PI / 180)) * parseFloat(acceleration)).toFixed(2));
    };

    this.setupEvents = function() {
        $(window).on('keydown', function(event) {
            switch (event.keyCode) {
                case 38: //up
                    self.fire(true);
                    break;
                case 37: //left
                    self.rotate(true, 'left');
                    break;
                case 39: //right
                    self.rotate(true, 'right');
                    break;
                case 32: //space
                    self.shoot();
                    break;
            }
        }).on('keyup', function(event) {
            switch (event.keyCode) {
                case 38: //up
                    self.fire(false);
                    break;
                case 37: //left
                    self.rotate(false);
                    break;
                case 39: //right
                    self.rotate(false);
                    break;
            }
        }).on('touchstart', function() {
            self.rotationRate = 0;
            self.fire(true);
        }).on('touchend', function() {
            self.fire(false);
            self.rotate(false);
        }).on('touchmove', function(event) {
            var xPosition = event.originalEvent.touches[0].clientX;
            if (xPosition > (self.windowWidth / 2)) { //rotate right
                self.rotationRate = self.maximumRotationRate * ((xPosition / 2) / (self.windowWidth / 2));
                self.rotate(true, 'right');
            } else {
                self.rotationRate = self.maximumRotationRate * (xPosition / (self.windowWidth / 2));
                self.rotate(true, 'left');
            }
        }).on('resize', function() {
            self.windowHeight = self.getWindowHeight();
            self.windowWidth = self.getWindowWidth();
        }).resize();
    };
    
    this.setupSubscribers = function() {
        WUC.settings.getSetting('rocket', 'acceleration', true).subscribe(function(newValue) {
            self.acceleration = newValue;
        });
    };
    
    this.start();

};
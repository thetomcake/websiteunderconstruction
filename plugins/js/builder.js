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

WUC._modules.builder = function() {
    
    var self = this;

    this.target = $('.WUCBuilder');
    this.targetSpeed = this.target.find('.WUCDays');
    this.interval = null;
    this.defaultHeight = '45px';
    this.defaultSpeed = 2;
    this.body = $('body');

    this.start = function() {
        if (!this.target.length) { return false; }

        WUC.Core.addCSS('plugins/css/builder.css');
        WUC.settings.setSetting('builder', 'speed', this.defaultSpeed);
        WUC.settings.setSetting('builder', 'height', this.defaultHeight);
        WUC.settings.setSetting('builder', 'image', 'running.gif');

        this.setupSubscribers();
        this.setupEvents();

        this.updateImage(WUC.settings.getSetting('builder', 'image'), function() {
            self.startMovement();
        });
    };

    this.startMovement = function() {
        self.target.css('left', self.target.data('startLeft'));
        
        this.interval = setInterval(function() {
            if (self.target.offset().left > $(window).width()) {
                self.target.css('left', self.target.data('startLeft'));
            } else {
                self.target.css('left', (parseFloat(self.target.css('left')) + parseFloat(WUC.settings.getSetting('builder', 'speed'))).toString() + 'px');
            }
        }, 10);

    };

    this.stopMovement = function() {
        if (this.interval !== null) {
            window.clearInterval(this.interval);
            this.interval = null;
        }
    };

    this.setupSubscribers = function() {
        WUC.settings.getSetting('builder', 'height', true).subscribe(function(newValue) {
            self.updateHeight();
        });
        WUC.settings.getSetting('builder', 'image', true).subscribe(function(newValue) {
            self.updateImage(newValue);
        });
    };
    
    this.updateImage = function(src, callback) {
        self.target.attr('src', src);
        self.target.one('load', function() {
            self.updateHeight();
            if ($.isFunction(callback)) {
                callback(); 
            };
        });
    };

    this.updateHeight = function() {
        this.target.css('height', WUC.settings.getSetting('builder', 'height'));
        WUC.container.css('padding-bottom', (parseInt(WUC.settings.getSetting('builder', 'height')) + 5) + 'px');
        this.updateTop();
        this.target.data('startLeft', 0 - this.target.width());
    };
    
    this.setupEvents = function() {
        $(window).resize(function() {
            self.updateTop();
        });
    };
    
    this.updateTop = function() {
        this.target.css('top', $('body').height() - this.target.height());
    };

    this.start();

};
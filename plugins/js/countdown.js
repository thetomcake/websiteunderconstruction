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

WUC._modules.countdown = function() {

    var self = this;

    this.target = $('.WUCCountdown');
    this.targetDays = this.target.find('.WUCDays');
    this.targetHours = this.target.find('.WUCHours');
    this.targetMinutes = this.target.find('.WUCMinutes');
    this.targetSeconds = this.target.find('.WUCSeconds');

    this.start = function() {

        if (!this.target.length) { return false; }
        
        var _defaultDate = new Date()
        _defaultDate.setHours(9);
        _defaultDate.setMinutes(0);
        _defaultDate.setSeconds(0);
        _defaultDate.setDate(_defaultDate.getDate() + 10);
        
        WUC.settings.setSetting('countdown', 'date', _defaultDate.toISOString().substr(0, 10) + ' ' + _defaultDate.toLocaleTimeString());

        self.calculateRemaining();

        setInterval(function() {
            self.calculateRemaining();
        }, 1000);
    };

    this.calculateRemaining = function() {
        
        var date = new Date(WUC.settings.getSetting('countdown', 'date'));
        
        var day = 60 * 60 * 24;
        var hour = 60 * 60;
        var minute = 60;

        var currentTime = new Date().getTime() / 1000;
        var targetTime = date.getTime() / 1000;
        var targetDiff = targetTime - currentTime;

        var remainingDays = Math.floor(targetDiff / day);
        targetDiff-=(remainingDays * day);
        var remainingHours = Math.floor(targetDiff / hour);
        targetDiff-=(remainingHours * hour);
        var remainingMinutes = Math.floor(targetDiff / minute);
        targetDiff-=(remainingMinutes * minute);
        var remainingSeconds = Math.floor(targetDiff);
        this.updateDOM(remainingDays, remainingHours, remainingMinutes, remainingSeconds);
    };

    this.updateDOM = function(days, hours, minutes, seconds) {

      this.targetDays.text(days);
      this.targetHours.text(hours);
      this.targetMinutes.text(minutes);
      this.targetSeconds.text(seconds);

    };
    
    this.start();

};
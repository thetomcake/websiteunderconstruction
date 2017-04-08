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

WUC._modules.page = function() {

    var self = this;
    
    this.titleDOM = $('head > title');
    this.headerDOM = $('.WUCHeader');
    this.title = WUC.settings.getSetting('page', 'title');
    this.header = WUC.settings.getSetting('page', 'header');
    this.defaultHeader = 'This Site Is Under Construction';
    this.defaultTitle = 'Website Under Construction';

    this.start = function() {
        if (WUC.settings.getSetting('page', 'title') === undefined) {
            WUC.settings.setSetting('page', 'title', this.defaultTitle);
            this.title = this.defaultTitle;
        }
        if (WUC.settings.getSetting('page', 'header') === undefined) {
            WUC.settings.setSetting('page', 'header', this.defaultHeader);
            this.header = this.defaultHeader;
        }
        
        this.setupSubscribers();
        
        this.updateHeader(this.header);
        this.updateTitle(this.title);
    };
    
    this.updateTitle = function(title) {
        self.titleDOM.text(title);
    };
    
    this.updateHeader = function(header) {
        self.headerDOM.text(header);
    };
    
    this.setupSubscribers = function() {
        WUC.settings.getSetting('page', 'title', true).subscribe(function(newValue) {
            self.updateTitle(newValue);
        });
        
        WUC.settings.getSetting('page', 'header', true).subscribe(function(newValue) {
            self.updateHeader(newValue);
        });
        
    };
    
    this.start();

};
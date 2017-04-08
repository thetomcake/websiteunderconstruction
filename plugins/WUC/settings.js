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

WUC.Core._modules.settings = function() {
    
    var self = this;

    this.height = 170;
    this.settingsDOM = null;
    this.settings = {};
    this.viewModel = null;
    this.body = $('body');

    this.start = function() {
        this.viewModel = new this._viewModel();
        
        $.get('plugins/WUC/settings.html', {}, function(data) {
            self.settingsDOM = $($(data)[2]);
            self.body.append(self.settingsDOM);
            self.applyKnockout();
            self.setupResize();
        });
        
    };
    
    this.setupResize = function() {
        this.settingsDOM
            .css('max-height', this.height + 'px')
            .css('min-height', this.height + 'px');
        
        $(window).resize(function() {
            self.reposition();
        }).resize();
    };
    
    this.reposition = function() {
        this.body.height($(window).height() - this.settingsDOM.outerHeight());
        this.settingsDOM.css('top', $(window).outerHeight() - this.height);
        this.repositionLeft();
    };
    
    this.repositionLeft = function() {
        this.settingsDOM.css('left', ($(window).width() - this.settingsDOM.outerWidth()) / 2);
    };
    
    this.applyKnockout = function() {
        ko.applyBindings(this.viewModel, this.settingsDOM[0]);
    };
    
    this.addScript = function(url) {
        this.viewModel.addScript(url);
    };
    
    this.setSetting = function(module, name, value) {
        this.viewModel.setSetting(module, name, value);
    };
    
    this.getSetting = function(module, name, returnObservable) {
        if (returnObservable === undefined) { returnObservable = false; }
        return (returnObservable === true) ? this.viewModel.getSetting(module, name) : this.viewModel.getSetting(module, name)();
    };
    
    this._viewModel = function() {
        this.modules = ko.observableArray();
        this.settings = ko.observableArray();
        this.scripts = ko.observableArray();
        
        /**
         * Adds a module into the settings array and adds it to the moduleSettingMap with an empty settings object.
         * @param {type} module
         * @returns undefined
         */
        this.addModule = function(module) {
            this.modules.push(module);
        };
        
        this.addSetting = function(module, setting, value) {
            this.settings.push({module: module, setting: setting, value: ko.observable(value)});
        };
        
        this.addScript = function(url) {
            this.scripts.push(url);
        };
        
        this.getModule = function(module) {
            returnValue = undefined;
            $.each(this.modules(), function(i, e) {
                if (e === module) {
                    returnValue = e;
                    return false;
                }
            });
            return returnValue;
        };
        
        this.getSetting = function(module, setting, returnObservable) {
            returnValue = function() {};
            $.each(this.settings(), function(i, e) {
                if (e.module === module && e.setting === setting) {
                    returnValue = e.value;
                    return false;
                }
            });
            return returnValue;
        };
        
        this.setSetting = function(module, setting, value) {
            var moduleExists = this.getModule(module);
            if (moduleExists === undefined) { this.addModule(module); }
            
            var settingValue = this.getSetting(module, setting);
            if (settingValue() === undefined) {
                this.addSetting(module, setting, value);
            } else {
                settingValue(value);
            }
        };
        
        this.afterRender = function() {
            self.repositionLeft();
        };
        
    };

    this.start();

};
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

$(document).ready(function () {
    
    WUC.Core = {};
    WUC.Core._modules = {};
    WUC.Core.modules = {};
    WUC._modules = {};
    WUC.modules = {};
    WUC.container = $('.WUCContainer');
    WUC.loader = $('.WUCLoader');
    
    var _coreModules = [
        {name: 'download', path: 'plugins/WUC'},
    ];

    WUC.Core.start = function () {
        var self = this;
        this.addCSS('plugins/WUC/download.css');
        this.addCSS('plugins/WUC/settings.css');
        this.addJS('plugins/WUC/settings.js', function() {
            self.addKnockout(function() {
                self.setupSettings();
                self.addCore(function() {
                    self.addOtherModules(function() {
                        self.loaded();
                    });
                });
            });
        });
    };
    
    WUC.Core.addKnockout = function(callback) {
        this.addJS('plugins/js/knockout-3.3.0.js', function() {
            if ($.isFunction(callback)) { callback(); }
        });
    };
    
    WUC.Core.addOtherModules = function(callback) {
        this.addModules([
            {name: 'countdown', path: 'plugins/js'},
            {name: 'page', path: 'plugins/js'},
            {name: 'builder', path: 'plugins/js'},
            {name: 'rocket', path: 'plugins/js'}
        ], WUC._modules, WUC.modules, true, callback);
    };
    
    WUC.Core.setupSettings = function() {
        this.modules.settings = new this._modules.settings();
        WUC.settings = this.modules.settings;
        return true;
    };
    
    WUC.Core.addModules = function(modules, moduleSource, moduleStore, addToScripts, callback) {
        var self = this;
        
        if ($.isFunction(addToScripts)) { callback = addToScripts; addToScripts = false; }
        
        var includedModules = 0;
        $.each(modules, function(i, module) {
            self.addJS(module.path + '/' + module.name + '.js', addToScripts, function() {
                moduleStore[module.name] = moduleSource[module.name].call({});
                includedModules++;
                if (includedModules === modules.length) {
                    if ($.isFunction(callback)) { callback(); }
                }
            });
        });
        if (!_coreModules.length && $.isFunction(callback)) { callback(); }
        
    };
    
    WUC.Core.addCore = function(callback) {
        this.addModules(_coreModules, this._modules, this.modules, callback);
    };
    
    WUC.Core.addCSS = function (file) {
        $('<link>').attr('rel', 'stylesheet').attr('type', 'text/css').attr('href', file).appendTo('head');
    };

    WUC.Core.addJS = function (file, addToScripts, callback) {
        
        if ($.isFunction(addToScripts)) { callback = addToScripts; addToScripts = false; }
        
        if (addToScripts === true) { WUC.settings.addScript(file); }
        
        $.getScript(file, function() {
            if ($.isFunction(callback)) { callback(); }
        });
    };
   
    WUC.Core.loaded = function() {
        if (WUC.loader.length) {
            WUC.loader.animate({opacity: 0}, 400, function() {
                WUC.loader.remove();
            });
        }
    };

    WUC.Core.start();

});
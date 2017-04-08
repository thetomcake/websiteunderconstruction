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
    
    WUC.Core.start = function() {
        console.log(':-) Downloaded from WUC :-)');
        
        if (window.location.protocol === 'file:') {
            alert('Due to the way WUC works, this page will not work properly using the file:// protocol. Please deploy onto a web server for the full glorious functionality to make an appearance');
        }

        this.modules.settings = new WUC.Core._modules.settings();
        WUC.settings = this.modules.settings;

        this.loadSettings();

    };
        
    WUC.Core.loadSettings = function() {
        var self = this;

        $.getJSON('plugins/WUC/data.json', {}, function(data) {
            WUC.settings.settings = data.settings;
            self.loadScripts(data.scripts, function() {
                self.loadModules();
                self.loaded();
                self.setupBodyResize();
            });
        });
    };
    
    WUC.Core.setupBodyResize = function() {
        var _body = $('body');
        $(window).on('resize', function() {
            _body.height($(window).height());
        }).resize();
    };
        
    WUC.Core.loadScripts = function(scripts, callback) {
        var self = this;
        var loadedScripts = 0;
        $.each(scripts, function(i, script) {
            self.addJS(script, function() {
                loadedScripts++;
                if (loadedScripts === scripts.length) {
                    if ($.isFunction(callback)) { callback(); }
                }
            });
        });
    };
        
    WUC.Core.loadModules = function() {
        $.each(WUC._modules, function(name, module) {
            WUC.modules[name] = new module;
        });
    };
        
    WUC.Core.addJS = function(file, callback) {
        $.getScript(file, callback);
    };
    
    WUC.Core.addCSS = function (file) {
        $('<link>').attr('rel', 'stylesheet').attr('type', 'text/css').attr('href', file).appendTo('head');
    };
        
    WUC.Core._modules.settings = function() {

        var self = this;

        this.settings = {};
        this.scripts = {};

        this.setSetting = function() { return true; } //this doesn't do anything after downloaded

        this.getSetting = function(module, name, returnObservable) {
            if (returnObservable === true) {
                return {
                    subscribe: (function() {})
                };
            } else {
                return (this.settings[module] !== undefined) ? this.settings[module][name] : undefined;
            }
        };
            

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
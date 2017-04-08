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

WUC.Core._modules.download = function() {

    this.start = function() {
        $.get('plugins/WUC/download.html', {}, function(data) {
            var _settingsDOM = WUC.Core.modules.settings.settingsDOM;
            $(_settingsDOM).append(data);
            
            $('.WUCDownloadButton').on('click', function(e) {
                e.preventDefault();
                $('.WUCSettingsForm').submit();
            });
        });
    };

    this.start();

};
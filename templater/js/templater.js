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


$(document).ready(function() {
   
    var beautifulTextArea = CodeMirror.fromTextArea($('#templater')[0]);
    beautifulTextArea.setSize('100%', '100%');
    
    var textarea = $('#templater');
    var form = $('#editorForm');
    
    $.get('../index.php', function(data) {
        beautifulTextArea.getDoc().setValue(data);
        updatePreview();
    });
    
    function updatePreview() {
        beautifulTextArea.save();
        form.submit();
    }
   
    beautifulTextArea.on('blur', function(event) {
        updatePreview();
        /*var preview = $('#preview');
        $.post(form.attr('action'), form.serialize(), function(data) {
            preview.html(data);
        });*/
   });
    
});
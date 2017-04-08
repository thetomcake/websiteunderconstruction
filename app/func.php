<?php

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

namespace app;

/**
 * Description of func
 *
 * @author Tom Lindley <tom a t tlkr dot co dot uk>
 */
class func {
    
    static public function ls($dir) {
        return array_values(preg_grep('/^([^.])/', scandir($dir)));
    }
    
        
    static public function setHeaders($extension) {
        switch (strtolower($extension)) {
            case 'jpg':
            case 'jpeg':
                header('Content-Type: image/jpg');
                break;
            case 'png':
                header('Content-Type: image/png');
                break;
            case 'js':
                header('Content-Type: application/x-javascript; charset=utf-8');
                break;
            case 'css':
            case 'map':
                header('Content-Type: text/css; charset=utf-8');
                break;
            case 'zip':
                header('Content-Type: application/octet-stream');
                break;
            case 'eot':
                header('Content-Type: application/vnd.ms-fontobject');
                break;
            case 'svg':
                header('Content-Type: image/svg+xml');
                break;
            case 'ttf':
                header('Content-Type: application/font-sfnt');
                break;
            case 'woff':
                header('Content-Type: application/font-woff');
                break;
            case 'html':
            default:
                header('Content-Type: text/html; charset=utf-8');
                
        }
    }
    
    static public function setZipHeaders($filename) {
        self::setHeaders('zip');
        header('Content-Disposition: attachment; filename=' . $filename); 
        header('Content-Transfer-Encoding: binary');
        return true;
    }
}

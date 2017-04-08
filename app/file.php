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
 * Description of file
 *
 * @author Tom Lindley <tom a t tlkr dot co dot uk>
 */
class file {
    
    static public function sanitizePath($path) {
        if (strpos($path, '..') !== false) { throw new Exception('File Contains ..'); }
        
        if (substr($path, 0, 10) === 'templater/') {
            $fullPath = realpath(templater::getDirectory() . DIRECTORY_SEPARATOR . $path);
        } elseif (substr($path, 0, 8) === 'plugins/') {
            $fullPath = realpath(plugin::getDirectory() . DIRECTORY_SEPARATOR . $path);
        } else {
            $fullPath = realpath(template::getDirectory() . DIRECTORY_SEPARATOR . $path);
        }
        
        $scriptFullPath = realpath(dirname($_SERVER['SCRIPT_FILENAME']));
        
        if ($fullPath === false) { throw new \Exception('File Not Found'); }
        if (substr($fullPath, 0, strlen($scriptFullPath)) !== $scriptFullPath) { throw new \Exception('File Invalid, does not match scriptFullPath'); }
        
        return $fullPath;
    }
    
    static public function output($filePath) {
        $sanitizedFilePath = self::sanitizePath($filePath);
        $pathInfo = pathinfo($sanitizedFilePath);
        func::setHeaders($pathInfo['extension']);
        echo file_get_contents($sanitizedFilePath);
        die();
    }
    
    //put your code here
}

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
 * Description of error
 *
 * @author Tom Lindley <tom a t tlkr dot co dot uk>
 */
class error {
    
    static public function handle($e) {
        self::log(date('Y-m-d H:i:s'));
        self::log('IP: ' . $_SERVER['SERVER_ADDR']);
        self::log('AGENT: ' . $_SERVER['HTTP_USER_AGENT']);
        self::log($e->getMessage());
        self::log(var_export($e->getTraceAsString(), true));
        self::log('----------------');
        self::output404();
    }
    
    static private function log($error) {
        return (false === file_put_contents(dirname($_SERVER['SCRIPT_FILENAME']) . DIRECTORY_SEPARATOR . 'error.log', $error . "\n", FILE_APPEND)) ? false : true;
    }
    
    static private function output404() {
        header('HTTP/1.1 404 Not Found');
        echo '404 Not Found';
        die();
    }
    
}

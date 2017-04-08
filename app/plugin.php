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
 * Description of plugin
 *
 * @author Tom Lindley <tom a t tlkr dot co dot uk>
 */
class plugin {
    
    static public function getDirectory() {
        return realpath(dirname($_SERVER['SCRIPT_FILENAME']) . DIRECTORY_SEPARATOR . 'plugins' . DIRECTORY_SEPARATOR);
    }
    
    static public function getDownloadDirectory() {
        return realpath(dirname($_SERVER['SCRIPT_FILENAME']) . DIRECTORY_SEPARATOR . 'downloadPlugins' . DIRECTORY_SEPARATOR . 'WUC' . DIRECTORY_SEPARATOR);
    }
}

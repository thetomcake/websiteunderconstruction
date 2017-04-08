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

/**
 * Description of index
 *
 * @author Tom Lindley <tom@tlkr.co.uk>
 */
error_reporting(E_ALL);
ini_set('display_errors', 'on');
session_start();

include('app/error.php');
include('app/file.php');
include('app/plugin.php');
include('app/template.php');
include('app/func.php');
include('app/templater.php');

class index {
    
    public function __construct() {
        try {
            ob_start();
            if (isset($_POST['template'])) {
                \app\templater::outputContent($_POST['template']);
            } else {
                if (!isset($_GET['q'])) {
                    \app\template::setRandom();
                    \app\file::output('index.html');
                } else {
                    if (substr($_GET['q'], 0, 8) === 'download') {
                        \app\template::download();
                    } elseif (substr($_GET['q'], 0, 9) === 'templater') {
                        \app\templater::output();
                    } else {
                        \app\file::output($_GET['q']);
                    }
                }
            }
            ob_end_flush();
        } catch (Exception $e) {
            \app\error::handle($e);
        }
    }

}

$index = new index;
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
 * Description of template
 *
 * @author Tom Lindley <tom a t tlkr dot co dot uk>
 */
class template {
    
    static public function setRandom() {
        $templateDirs = func::ls('templates');
        
        if (!count($templateDirs)) { throw new Exception('No Templates'); }
        
        $_SESSION['template'] = $templateDirs[rand(0, (count($templateDirs) - 1) )];
        return true;
    }
    
    static public function getDirectory() {
        if (!isset($_SESSION['template'])) { throw new Exception('Template Not Set'); }
        return realpath(dirname($_SERVER['SCRIPT_FILENAME']) . DIRECTORY_SEPARATOR . 'templates' . DIRECTORY_SEPARATOR . $_SESSION['template'] . DIRECTORY_SEPARATOR);
    }
    
    static private function _getDefaultSettings() {
        return array(
            'page' => array(
                'title' => 'Website Under Construction',
                'header' => 'This Site Aint Ready Yet'
            ),
            'countdown' => '2015-05-05 12:12:12'
        );
    }
    
    static public function download() {
        
        $settingsJson = json_encode(
            array(
                'settings' => ((isset($_POST['settings']) && is_array($_POST['settings'])) ? $_POST['settings'] : self::_getDefaultSettings()),
                'scripts' => self::_validateScripts((isset($_POST['scripts']) && is_array($_POST['scripts'])) ? $_POST['scripts'] : array())
            )
        );

        $pluginDirs = array('css', 'html', 'js');
        
        $zipFile = tempnam(sys_get_temp_dir(), 'WUC');
        $zip = new \ZipArchive();
        if ($zip->open($zipFile, \ZipArchive::CREATE) === TRUE) {
            $templateFiles = func::ls(self::getDirectory());
            foreach ($templateFiles as $file) {
                $content = self::_applyAlterations(file_get_contents(self::getDirectory() . DIRECTORY_SEPARATOR . $file));
                $zip->addFromString($file, $content);
            }
            
            $zip->addEmptyDir('plugins');
            foreach ($pluginDirs as $dir) {
                $pluginFiles = func::ls(plugin::getDirectory() . DIRECTORY_SEPARATOR . $dir);
                $zip->addEmptyDir('plugins' . DIRECTORY_SEPARATOR . $dir);
                foreach ($pluginFiles as $file) {
                    $zip->addFile(plugin::getDirectory() . DIRECTORY_SEPARATOR . $dir . DIRECTORY_SEPARATOR . $file, 'plugins' . DIRECTORY_SEPARATOR . $dir . DIRECTORY_SEPARATOR . $file);
                }
            }
            
            $zip->addEmptyDir('plugins/WUC');
            $downloadPluginFiles = func::ls(plugin::getDownloadDirectory());
            foreach ($downloadPluginFiles as $file) {
                $zip->addFile(plugin::getDownloadDirectory() . DIRECTORY_SEPARATOR . $file, 'plugins/WUC/' . $file);
            }
            $zip->addFromString('plugins/WUC/data.json', $settingsJson);
            
            $zip->close();
            $zipBin = file_get_contents($zipFile);
            unlink($zipFile);
            func::setZipHeaders('template.zip');
            echo $zipBin;
            die();
        } else {
            unlink($zipFile);
            throw new Exception('Could not open Zip');
        }
    }
    
    static private function _validateScripts($scripts) {
        foreach ($scripts as &$script) {
            if (!is_string($script)) { throw new Exception('Invalid Script Input'); }
            $script = htmlentities($script);
        }
        return $scripts;
    }
    
    static private function _applyAlterations($content) {
        return $content;
    }
    
}

<?php
/**
* @author Martin Kolb <edi@ediathome.de>
* @copyright 2018 Martin Kolb
*
* based on default template source code from PrestaShop
* which is released under http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
* (c) 2007-2018 PrestaShop SA
*  PrestaShop is an International Registered Trademark & Property of PrestaShop SA
*
* Faker php library is written by François Zaninotto
* Copyright (c) 2011 François Zaninotto
* https://github.com/fzaninotto/Faker
* for license see https://github.com/fzaninotto/Faker/blob/master/LICENSE
*/
if (!defined('_PS_VERSION_')) {
    exit;
}

require_once dirname(__FILE__).'/classes/PrestaCollegeAutoUpgrader.php';

class PrestaThema extends Module
{
    protected $config_form = false;
    const GITHUB_PROJECT_URL = 'https://api.github.com/repos/fitforecommerce/prestacollege';

    public function __construct()
    {
        $this->debug = false;
        $this->name = 'prestathema';
        $this->tab = 'others';

        $this->version = "0.1.0";
        $this->author = 'Martin Kolb';
        $this->need_instance = 1;

        /*
         * Set $this->bootstrap to true if your module is compliant with bootstrap (PrestaShop 1.6)
         */
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('PrestaThema');
        $this->description = $this->l('A module for quickly styling Prestashop themes from the Backend');
        
        # '/themes/classic/assets/css'
        $this->themes_path = dirname(dirname($this->local_path)).'/themes/child_classic/assets/css';
        $this->custom_css_path = $this->themes_path . '/custom.css';

        $this->ps_versions_compliancy = array('min' => '8.1.2', 'max' => _PS_VERSION_);
    }

    public function auto_upgrader()
    {
      if(isset($this->auto_upgrader)) {
        return $this->auto_upgrader;
      }
      $this->auto_upgrader = new PrestaCollegeAutoUpgrader();
      return $this->auto_upgrader;
    }
    /**
     * Don't forget to create update methods if needed:
     * http://doc.prestashop.com/display/PS16/Enabling+the+Auto-Update.
     */
    public function install()
    {
        Configuration::updateValue('PRESTATHEMA_LIVE_MODE', false);

        return parent::install() &&
            $this->registerHook('header') &&
            $this->registerHook('displayBackOfficeHeader');
    }

    public function uninstall()
    {
        Configuration::deleteByName('PRESTATHEMA_LIVE_MODE');

        return parent::uninstall();
    }

    public function getContent()
    {
      $output = '';
      $output .= "<h1>PrestaThema hey there!</h1>";

      $action_done = false;
      $action = Tools::getValue('PRESTATHEMA_ACTION', '');

      $theme_dir_entries = [];
      $d = dir($this->themes_path);
      while (false !== ($entry = $d->read())) {
        $theme_dir_entries[] = $entry;
      }

      $this->context->smarty->assign('module_dir', $this->_path);
      $this->context->smarty->assign('tpl_dir', dir($this->themes_path));
      $this->context->smarty->assign('theme_dir_entries', $theme_dir_entries);
      $this->context->smarty->assign('form_action_url', $this->admin_link());
      $this->context->smarty->assign('file_contents', $this->read_file($this->custom_css_path));

      if ($this->debug) {
          $output .= '<hr><code>'.print_r($_REQUEST, true).'</code>';
      }

      $output .= $this->context->smarty->fetch($this->local_path.'views/templates/editor.tpl');

      return $output;
    }

    private function read_file($fpath)
    {
      return file_get_contents($fpath);
    }

    private function admin_link()
    {
        return $this->context->link->getAdminLink('AdminModules', true)
                  .'&configure='.$this->name.'&tab_module='.$this->tab.'&module_name='.$this->name;
    }

    /**
     * Add the CSS & JavaScript files you want to be loaded in the BO.
     */
    public function hookBackOfficeHeader()
    {
        if (Tools::getValue('configure') == $this->name) {
            $this->context->controller->addJS($this->_path.'views/js/prestathemajs.js');
            $this->context->controller->addCSS($this->_path.'views/css/back.css');
        }
    }

    /**
     * Add the CSS & JavaScript files you want to be added on the FO.
     */
    public function hookHeader()
    {
        // $this->context->controller->addJS($this->_path.'/views/js/front.js');
        // $this->context->controller->addCSS($this->_path.'/views/css/front.css');
    }
}

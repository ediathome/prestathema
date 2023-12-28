<?php
/**
* @author Martin Kolb <edi@ediathome.de>
* @copyright 2023 Martin Kolb
*
* based on default template source code from PrestaShop
* which is released under http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
* (c) 2007-2018 PrestaShop SA
*  PrestaShop is an International Registered Trademark & Property of PrestaShop SA
*
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
        
        $this->templates_path = $this->local_path.'views/templates';
  
        $this->presta_themes_path = dirname(dirname($this->local_path)).'/themes';
        # set the default path 
        $this->current_dir_path = $this->presta_themes_path;

        if(isset($_GET['cdir'])) {
          $test_path = $this->presta_themes_path . $_GET['cdir'];
          if(is_dir($test_path)) {
            $this->current_dir_path = $test_path;
          } elseif(file_exists($test_path)) {
            $this->current_dir_path = dirname($test_path);
            $this->custom_css_path = $test_path;
          }
        }

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
      $json_request = json_decode(file_get_contents('php://input'), true);
      if(is_array($json_request) && isset($json_request["content"])) {
        $fp = fopen($this->custom_css_path, 'w');
        fwrite($fp, $json_request['content']);
        fclose($fp);
        error_log("PrestaThema did write: " . print_r($json_request, true));

        http_response_code(200);
        header("Content-Type: application/json;");
        exit();
      }

      $output = '';

      $action_done = false;
      $action = Tools::getValue('PRESTATHEMA_ACTION', '');

      $dir_entries_sorted = array_keys($this->file_entries($this->current_dir_path));
      sort($dir_entries_sorted);

      $this->context->smarty->assign('module_dir', $this->_path);
      $this->context->smarty->assign('tpl_dir', dir($this->presta_themes_path));

      $this->context->smarty->assign('current_dir_path', $this->current_dir_path);
      $this->context->smarty->assign('dir_entries', $this->file_entries($this->current_dir_path));
      $this->context->smarty->assign(
        'dir_entries_sorted', 
        $dir_entries_sorted
      );
      $this->context->smarty->assign('form_action_url', $this->admin_link());
      $this->context->smarty->assign('custom_css_path', $this->custom_css_path);

      if ($this->debug) {
          $output .= '<hr><code>'.print_r($_REQUEST, true).'</code>';
      }

      if(file_exists($this->custom_css_path)) {
        $this->context->smarty->assign('file_contents', $this->read_file($this->custom_css_path));
        $output .= $this->context->smarty->fetch($this->templates_path.'/filelist.tpl');
        $output .= $this->context->smarty->fetch($this->templates_path.'/editor.tpl');
        
      } elseif(isset($this->custom_css_path)) {
        $output .= $this->context->smarty->fetch($this->templates_path.'/error_file_not_found.tpl');
        $output .= $this->context->smarty->fetch($this->templates_path.'/filelist.tpl');
      } else {
        $output .= $this->context->smarty->fetch($this->templates_path.'/filelist.tpl');
      }

      return $output;
    }

    # see icons at https://fonts.google.com/icons?icon.style=Rounded&selected=Material+Symbols+Rounded:file_open:FILL@0;wght@400;GRAD@0;opsz@24&icon.query=file
    private function file_entries($dir, $show_parent=true)
    {
      $rv = [];
      $d = dir($dir);
      if(!$d) {
        echo("No dir found for path: $dir");
        return [];
      }
      if($show_parent) {
        $rv[dirname($dir)] = array(
          'filename' => '.. ⇧ ..',
          'path' => dirname($dir),
          'editable' => true,
          'icon' => '',
          'url' => $this->action_url(array(
            'cdir' => str_replace($this->presta_themes_path.'/', '', dirname($dir))
          ))
        );
      }
      
      while (false !== ($entry = $d->read())) {
        if(!str_starts_with($entry, '.')) {
          $tmp = array(
            'filename' => $entry,
            'path' => $d->path.'/'.$entry,
            'editable' => true,
            'icon' => 'file_open',
            'url' => $this->action_url(array(
              'PRESTATHEMA_ACTION' => 'edit_file',
              'cdir' => str_replace($this->presta_themes_path, '', $d->path).'/'.$entry
            ))
          );
          $rv[$entry] = $tmp;
        }
      }
      return $rv;
    }

    private function read_file($fpath)
    {
      return file_get_contents($fpath);
    }

    private function action_url($params=[])
    {
      $rv = $this->admin_link();
      foreach ($params as $k => $v) {
        $rv .= '&'.urlencode($k).'='.urlencode($v);
      }
      return $rv;
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

<?php
class PrestaCollegeAutoUpgrader
{
  public function installed_version()
  {
    if(isset($this->installed_version)) return $this->installed_version;

    $sql = 'SELECT * FROM `' . _DB_PREFIX_ . 'module` WHERE name="prestacollege";';

    if ($results = Db::getInstance()->executeS($sql)) {
      $this->installed_version = $results[0]['version'];
    } else {
      error_log("Prestacollege::PrestaCollegeAutoUpgrader:installed_version() - no db entry found!");
      $this->installed_version = '0.7.0';
    }
    return $this->installed_version;
  }

  public function update_available()
  {
    return version_compare($this->installed_version(), $this->get_latest_prestacollege_version());
  }
  # 
  # see Prestashop /src/Adapter/Addons/AddonsDataProvider.php 
  #
  public function get_latest_prestacollege_version()
  {
    if(isset($this->latest_prestacollege_version)) return $this->latest_prestacollege_version;
    try {
      $rv = $this->installed_version();
      $tmp_vno = $this->releases_latest_version();

      if(version_compare($rv, $tmp_vno) < 0) {
        $rv = $tmp_vno;
      }
    } catch (Exception $e) {
      return $this->installed_version();
    }
    $this->latest_prestacollege_version = $rv;
    return $this->latest_prestacollege_version;
  }
  public function get_latest_downloaded_version()
  {
    
  }
  public function download_update()
  {
    # $this->zipManager->storeInModulesFolder($temp_filename);
    $curler = new FakerCurler();
    $curler->snapshotdir = $this->upgrades_download_dir();
    $url = $this->releases_data_latest()->assets[0]->browser_download_url;
    error_log("PrestaCollege::download_update() $url");
    $curler->run($url);
  }
  private function upgrades_download_dir()
  {
    return _PS_MODULE_DIR_.'prestacollege'.DIRECTORY_SEPARATOR.'upgrades'.DIRECTORY_SEPARATOR;
  }
  private function releases_data()
  {
    if(isset($this->releases_data)) {
      return $this->releases_data;
    }
    #
    # somehow ensure to not hit
    # the github api limit as detailled here:
    # https://developer.github.com/v3/#rate-limiting
    #
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, PrestaCollege::GITHUB_PROJECT_URL.'/releases');
    curl_setopt($ch, CURLOPT_USERAGENT, 'PrestaCollege::AutoUgrader'); 
    curl_setopt($ch, CURLOPT_TIMEOUT, 600);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

    $json = curl_exec($ch);
    $json = json_decode ($json);

    curl_close($ch);

    $this->releases_data = $json;
    return $this->releases_data;
  }
  private function releases_latest_version()
  {
    return substr($this->releases_data_latest()->tag_name,1);
  }
  private function releases_data_latest()
  {
    foreach($this->releases_data() as $release) {
      error_log("release is a: ".$release);
      if(!isset($rv)) {
        $rv = $release;
      }

      $rv_vno = substr($rv->tag_name, 1);
      $tmp_vno = substr($release->tag_name, 1);

      if(version_compare($rv_vno, $tmp_vno) < 0) {
        $rv = $release;
      }
    }
    return $rv;
  }
}
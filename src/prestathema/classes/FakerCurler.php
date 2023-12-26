<?php
/**
* A class for downloading files via curl.
*/
class FakerCurler
{
  var $snapshotdir;
  public function __construct()
  {
    @set_time_limit(0);
    @ini_set('max_execution_time', '0');
    $this->snapshotdir = false;
  }

  public function run($url = NULL)
  {
    if(!isset($url)) {
      $url = $this->snapshot_user_url();
    }
    $url = trim($url);
    try {
      $this->curl_file($url);
    } catch (Exception $e) {
      return "<div class='alert alert-warning'>Error in FakerCurler when downloading file <p><code>$e</code></p></div>";
    }

    return "<div class='alert alert-success'>Snapshot successfully downloaded. You can now install it.</div>";
  }

  protected function curl_file($url)
  {
    SnapshotDir::mkdir_unless_exist($this->curl_target_dir());

    $destination = $this->curl_target_dir().'/'.$this->filename($url);
    $destination = trim($destination);

    $file = fopen($destination, 'w+');
    error_log('FakerCurler::curl_file from url: "'.$url.'" to '.$destination);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    # curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    # curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    # curl_setopt($ch, CURLOPT_SSLVERSION, 3);
    curl_setopt($ch, CURLOPT_TIMEOUT, 600);
    curl_setopt($ch, CURLOPT_FILE, $file);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

    # error_log(print_r(curl_getinfo ($ch), true));

    curl_exec($ch);
    curl_close($ch);

    fclose($file);
  }
  protected function curl_target_dir()
  {
    if($this->snapshotdir() instanceof SnapshotDir) {
      return $this->snapshotdir()->dir_path;
    }
    return $this->snapshotdir();
  }
  protected function snapshotdir()
  {
    return $this->snapshotdir;
  }

  private function snapshot_user_url()
  {
    $url = Tools::getValue('snapshotcurlurl');
    if(!isset($url) || $url=='') {
      throw new Exception("No url provided for database snapshot!", 1);
    }
    return $url;
  }

  private function filename($url)
  {
    $parts = parse_url($url);
    $str = basename($parts['path']);
    return $str;
  }
} // END class FakerCurler

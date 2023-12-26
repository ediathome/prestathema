<?php
/**
 * A class for downloading DB snapshots from a url.
 */
class FakerFileCurler extends FakerCurler
{
  public function __construct()
  {
    parent::__construct();
    $this->snapshotdir = new SnapshotDir(FakerFileBackup::snapshotdir());
  }
} // END class FakerDatabaseCurler

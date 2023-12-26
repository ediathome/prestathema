<?php
/**
 * A class for downloading DB snapshots from a url.
 */
class FakerDatabaseCurler extends FakerCurler
{
  public function __construct()
  {
    parent::__construct();
    $this->snapshotdir = new SnapshotDir(FakerDatabaseBackup::snapshotdir());
  }
} // END class FakerDatabaseCurler

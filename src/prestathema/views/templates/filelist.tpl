<div class="panel panel-default">
  <h2>Dateien</h2>
  <div>Pfad: {$current_dir_path}</div>
  <ul class="list-group">
  {foreach $dir_entries_sorted as $k}
    {assign "f"  $dir_entries[$k]}
    <li class="list-group-item">
      {if $f['editable']}
        <a href="{$f['url']}">
          <i class="material-icons" style="font-size:16px;">{$f['icon']}</i>
          {$f['filename']|escape}
        </a>
      {else}
        <i class="material-icons" style="font-size:16px;">{$f['icon']}</i>
        {$f['filename']|escape}
      {/if}
    </li>
  {/foreach}
  </ul>
</div>
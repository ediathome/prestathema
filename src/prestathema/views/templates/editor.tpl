

<ul style="display: none">
{foreach $theme_dir_entries as $e}
  <li>{$e|escape}</li>
{/foreach}
</ul>

<textarea id="prestathema-source" style="display: none;">{$file_contents}</textarea>

<div id="prestathema-editor">
  <div class=" panel panel-default">Editing: {$custom_css_path}</div>
</div>
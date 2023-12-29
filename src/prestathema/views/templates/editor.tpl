<textarea id="prestathema-source" style="display: none;">{$file_contents}</textarea>

<div id="prestathema-editor" class="panel panel-default" style="height: 100%" data-display-editor="{if $display_editor}1{else}0{/if}">
  {if $display_editor}
    <div class="m-4">Datei: {$custom_css_path}</div>
  {else}
    <div class="alert alert-warning">
      Bitte wählen Sie eine Datei zum Bearbeiten aus.
    </div>
  {/if}
</div>
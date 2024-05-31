<?php

if (!defined('DOKU_INC')) {
	die();
}

class action_plugin_tablecalc extends DokuWiki_Action_Plugin {

	public function register(Doku_Event_Handler $controller) {
		$controller->register_hook('TPL_METAHEADER_OUTPUT', 'BEFORE', $this,
                                   '_loadtablecalc');
	}

	public function _loadtablecalc(Doku_Event $event, $param) {
		$event->data['script'][] = array(
			'type'    => 'text/javascript',
			'charset' => 'utf-8',
			'_data'   => '',
			'src' => DOKU_BASE."lib/plugins/tablecalc/script.js");

	}
}
?>
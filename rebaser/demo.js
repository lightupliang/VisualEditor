/*!
 * VisualEditor rebaser demo
 *
 * @copyright 2011-2018 VisualEditor Team and others; see http://ve.mit-license.org
 */

( function () {
	function RebaserTarget() {
		RebaserTarget.super.apply( this, arguments );

		// HACK: Disable history commands until supported (T185706)
		ve.ui.commandRegistry.unregister( 'undo' );
		ve.ui.commandRegistry.unregister( 'redo' );
	}

	OO.inheritClass( RebaserTarget, ve.init.sa.Target );

	RebaserTarget.static.toolbarGroups = ve.copy( RebaserTarget.static.toolbarGroups );
	RebaserTarget.static.toolbarGroups.splice( 4, 0, {
		name: 'commentAnnotation',
		include: [ 'commentAnnotation' ]
	} );

	RebaserTarget.static.actionGroups = ve.copy( RebaserTarget.static.actionGroups );
	RebaserTarget.static.actionGroups.push(
		{
			name: 'authorList',
			include: [ 'authorList' ]
		}
	);

	RebaserTarget.prototype.setSurface = function ( surface ) {
		var synchronizer, surfaceView;

		if ( surface !== this.surface ) {
			surfaceView = surface.getView();

			synchronizer = new ve.dm.SurfaceSynchronizer(
				surface.getModel(),
				ve.docName,
				{ server: this.rebaserUrl }
			);

			surfaceView.setSynchronizer( synchronizer );
		}

		// Parent method
		RebaserTarget.super.prototype.setSurface.apply( this, arguments );
	};

	new ve.init.sa.Platform( ve.messagePaths ).initialize().done( function () {
		var panel = new OO.ui.PanelLayout( {
				$element: $( '.ve-demo-editor' ),
				expanded: false,
				framed: true
			} ),
			target = new RebaserTarget();

		panel.$element.append( target.$element );

		target.addSurface( ve.dm.converter.getModelFromDom( ve.createDocumentFromHtml( '' ) ) );
		target.surface.view.focus();
	} );
}() );

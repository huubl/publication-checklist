import PropTypes from 'prop-types';

import { Button, Modal } from '@wordpress/components';
import { Component, Fragment } from '@wordpress/element';
import { PostPublishButton } from '@wordpress/editor';
import { __, _n, sprintf } from '@wordpress/i18n';

import ConfirmPublishButton from './ConfirmPublishButton';

class ConfirmPublish extends Component {
	state = {
		showingConfirm: false,
	}

	onShowConfirm = () => {
		this.setState( { showingConfirm: true } );
	}

	/**
	 * @param {Event} e - Click event.
	 */
	onCancelConfirm = ( e ) => {
		e.stopPropagation();
		this.setState( { showingConfirm: false } );
	}

	render() {
		const {
			baseClassName,
			canBePublished,
			forceIsDirty,
			forceIsSaving,
			isBeingScheduled,
			toComplete,
		} = this.props;

		const {
			showingConfirm,
		} = this.state;

		if ( canBePublished ) {
			return (
				<Fragment>
					<PostPublishButton
						focusOnMount={ true }
						onSubmit={ this.onSubmit }
						forceIsDirty={ forceIsDirty }
						forceIsSaving={ forceIsSaving }
					/>
				</Fragment>
			);
		}

		const popoverClass = `${ baseClassName }__confirm`;

		/* translators: %s: total number of to-complete tasks */
		const label = sprintf(
			_n(
				'There is %s incomplete task in your Publication Checklist.',
				'There are %s incomplete tasks in your Publication Checklist.',
				toComplete,
				'hm-publication-checklist'
			),
			toComplete,
		);

		const buttonLabel = ( isBeingScheduled
			? __( 'Schedule…', 'hm-publication-checklist' )
			: __( 'Publish…', 'hm-publication-checklist' )
		);

		return (
			<Button
				className="editor-post-publish-button"
				isLarge={ true }
				isPrimary={ true }
				onClick={ this.onShowConfirm }
			>
				{ buttonLabel }

				{ showingConfirm && (
					<Modal
						className={ popoverClass }
						overlayClassName={ `${ baseClassName }__confirm-overlay` }
						title={ __( 'Ignore incomplete tasks?', 'hm-publication-checklist' ) }
						onRequestClose={ this.onCancelConfirm }
					>
						<p>{ label }</p>

						<div className={ `${ popoverClass }-buttons` }>
							<Button
								isDefault={ true }
								isLarge={ true }
								onClick={ this.onCancelConfirm }
							>
								Cancel
							</Button>

							<ConfirmPublishButton
								focusOnMount={ true }
								forceIsDirty={ forceIsDirty }
								forceIsSaving={ forceIsSaving }
							/>
						</div>
					</Modal>
				) }
			</Button>
		);
	}
}

ConfirmPublish.propTypes = {
	baseClassName: PropTypes.string.isRequired,
	canBePublished: PropTypes.bool.isRequired,
	forceIsDirty: PropTypes.bool.isRequired,
	forceIsSaving: PropTypes.bool.isRequired,
	isBeingScheduled: PropTypes.bool.isRequired,
	toComplete: PropTypes.number.isRequired,
};

export default ConfirmPublish;

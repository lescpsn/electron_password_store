import React from 'react';
import {connect} from 'react-redux';
import StorageCategoriesList from './StorageCategoriesList'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import ActionSave from 'material-ui/svg-icons/content/save';
import AlertStatus from '../../const/AlertStatus';
import {addRecord} from '../../api/Storage'
import {RecordAdd, Alert} from '../../const/Events'
import {CategoryError, Alert as AlertMessages} from '../../const/Messages'

const AddForm = (state) => {
	let store = state.store;
	const textField = [
		'title',
		'login',
		'pass',
		'answer',
	];

	const onSave = () => {
		state.onSave();

		if (!store.category) {
			return state.onCategoryError(CategoryError.noSelect);
		}

		let isEmpty = true;

		for (let i = 0; i < textField.length; i) {
			let name = textField[i];

			if (store[name]) {
				isEmpty = false;
				break;
			}
		}

		if (isEmpty && !store.desk) {
			return state.showAlert(AlertMessages.empty, AlertStatus.BAD);
		}

		addRecord({
			category: store.category,
			title: store.title,
			login: store.login,
			pass: store.pass,
			desc: store.desc,
			answer: store.answer
		}).then(data => {
			state.save(data);
			state.clear();
			state.showAlert(AlertMessages.save, AlertStatus.OK);
		}, err => {
			state.showAlert(AlertMessages.errorSave, AlertStatus.BAD);
		});

	};

	return (
		<Paper >
			<StorageCategoriesList error={store.errorCategory} onEdit={state.onEditCategory} val={store.category}
			                       label='Choice category'/><br/>
			{
				textField.map(name =>
					<div key={'warpAdd' + name}>
						<TextField id={'add' + name}
						           value={store[name]}
						           hintText={'Enter ' + name}
						           onChange={ev => state.onEditText(name, ev.target.value)}
						/>
					</div>
				)
			}
			<textarea onChange={state.onEditDesc} value={store.desc} placeholder='Enter descriptions' rows='10'
			          cols='30'/><br/>
			<RaisedButton
				label="Save"
				primary={true}
				style={{margin: '5px'}}
				icon={<ActionSave />}
				onTouchTap={onSave}
			/>
		</Paper>
	);
};

export default connect(
	state => ({
		store: state.recordAdd
	}),
	dispatch => ({
		clear: () => dispatch({type: RecordAdd.init}),
		save: data => dispatch({type:RecordAdd.save , data: data}),
		showAlert: (mess, type) => dispatch({
			type: Alert.show, data: {
				message: mess,
				status: type
			}
		}),
		onCategoryError: err => dispatch({type: RecordAdd.errCat, data: err}),
		onSave: () => dispatch({type: RecordAdd.saved}),
		onEditCategory: (event, index, value) => dispatch({type: RecordAdd.change, data: {
			type: 'category',
			val : value
		}}),
		onEditDesc: (event) => dispatch({type: RecordAdd.change, data: {
			type: 'desc',
			val : event.target.value
		}}),
		onEditText: (type, val) => dispatch({
			type: RecordAdd.change, data: {
				type: type,
				val: val
			}
		})
	})
)(AddForm);

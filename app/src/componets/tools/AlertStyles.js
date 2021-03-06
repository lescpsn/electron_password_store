import {ok, bad} from '../../const/Colors'
const shareIcons = {
	marginLeft : '15px',
};
const size = {
	height : '40px',
	width  : '40px',
};
const icoOk = {
	...shareIcons,
	...size,
	color : ok
};
const paper = {
	padding: '5px',
};

const icoBad = {
	...icoOk,
	color : bad
};

export {
	icoBad,
	icoOk,
	paper
};

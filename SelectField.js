"use strict";

// React imports
import React from "react";
// Material-UI imports
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { MenuItem,  } from 'material-ui/Menu';
import List from 'material-ui/List';
import TextField from 'material-ui/TextField';

// SelectField Component
class SelectField extends React.Component {
	constructor(props){
		super(props);
		this.state = { open: false, lockOpen: false };
	}
	
	// Open & Close options //
	handleOnBlur = () => setTimeout(() => { if(!this.state.lockOpen){this.setState({open: false});} }, 100);
	handleOnClick = () => this.setState({ open: !this.state.open, lockOpen: false });
	handleOnClickContainer = () => this.setState({ lockOpen: true });
	handleOnClickOption = (index) => { this.setState({ open: false, lockOpen: false }); this.props.onChange(index); };
	
	// Press Key & Scroll to options //
	handleOnKeyDown = (event) => console.log(event);
	
	// Render Components //
	OptionsContainer = (props) => {
		const { children, ...other } = props;
		return (<Paper square onClick={this.handleOnClickContainer} {...other}><List>{children}</List></Paper>);
	};
	
	Option = (props) => {
		const { name, value } = props;
		return (<MenuItem selected={value===this.props.value} onClick={() => this.handleOnClickOption(value)}>{name}</MenuItem>);
	};
	
	render(){
		const { classes, onChange, children, optionProps, optionContainerProps, ...other } = this.props;
		const { OptionsContainer, Option } = this;
		const containerClass = this.props.fullWidth ? classes.container + " " + classes.fullWidth : classes.container;
		return (
			<div className={containerClass} onClick={this.handleOnClick} onBlur={this.handleOnBlur} onKeyDown={this.handleOnKeyDown}>
				<TextField type="text" inputProps={{style:{cursor:'pointer', userSelect: 'none'}, readOnly:true}} {...other} />
				{ this.state.open ?
					<OptionsContainer className={classes.optionContainer} {...optionContainerProps}>
						{children.map((option) => <Option {...optionProps} key={option.value} name={option.name} value={option.value}/>)}
					</OptionsContainer>
				: null }
			</div>
		);
	}
}
const styleSheet_1 = createStyleSheet('SelectField', theme => ({
	fullWidth: { width: '100%' },
	container: { position: 'relative', display: 'inline-block' },
	optionContainer: {
		position: 'absolute', zIndex: theme.zIndex.popover, left: 0, right: 0,
		marginBottom: theme.spacing.unit * 3, marginTop: theme.spacing.unit * 0,
		maxHeight: theme.spacing.unit * 30, overflow: 'auto',
	}
}));
SelectField = withStyles(styleSheet_1)(SelectField);

export default SelectField;

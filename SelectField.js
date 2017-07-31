"use strict";

// React imports
import React from "react";
import ReactDOM from 'react-dom';
// Material-UI imports
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { MenuItem,  } from 'material-ui/Menu';
import List from 'material-ui/List';
import TextField from 'material-ui/TextField';

////////////////
// Components //
////////////////

// SelectOption Component
class SelectOption extends React.Component {
	constructor(props){
		super(props);
	}
	
	componentDidMount(){ if(this.props.highlighted) ReactDOM.findDOMNode(this).scrollIntoView(false); }
	
	componentWillReceiveProps(nextProps){
		if(this.props.highlighted != nextProps.highlighted){
			if(nextProps.highlighted) ReactDOM.findDOMNode(this).scrollIntoView(false);
		}
	}
	
	render() {
		const { highlighted, ...other } = this.props;
		return (<MenuItem {...other} selected={highlighted} />);
	}
}
			
// SelectField Component
class SelectField extends React.Component {
	constructor(props){
		super(props);
		this.state = { open: false, lockOpen: false, highlighted: this.props.value };
	}
	
	// Open & Close options //
	handleOnBlur = () => setTimeout(() => { if(!this.state.lockOpen){this.setState({open: false, highlighted: this.props.value});} }, 100);
	handleOnClick = () => this.setState({ open: !this.state.open, lockOpen: false, highlighted: this.props.value });
	handleOnClickContainer = () => this.setState({ lockOpen: true });
	handleOnClickOption = (index) => { this.setState({ open: false, lockOpen: false, highlighted: this.props.value }); this.props.onChange(index); };
	
	// Search & Scroll to options //
	handleOnKeyDown = (event) => {
		var key = event.key.toUpperCase();
		if(key==="ENTER"){
			this.setState({ open: !this.state.open, lockOpen: false, highlighted: this.props.value });
		}else if(key.isLetter()){
			var targetValue = this.props.children.find((option) => option.name.toUpperCase().startsWith(key)).value;
			if(targetValue) this.setState({highlighted:targetValue});
		}
	}
	
	// Render Components //
	OptionsContainer = (props) => {
		const { children, ...other } = props;
		return (<Paper square onClick={this.handleOnClickContainer} {...other}><List>{children}</List></Paper>);
	};
	
	Option = (props) => {
		const { name, value, ...other } = props;
		return (<SelectOption selected={value===this.props.value} highlighted={value===this.state.highlighted} onClick={() => this.handleOnClickOption(value)} {...other}>{name}</SelectOption>);
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
						{children.map((option) => <Option key={option.value} {...optionProps} name={option.name} value={option.value}/>)}
					</OptionsContainer>
				: null }
			</div>
		);
	}
}
const styleSheet = createStyleSheet('SelectField', theme => ({
	fullWidth: { width: '100%' },
	container: { position: 'relative', overflow: 'hiden', display: 'inline-block' },
	optionContainer: {
		position: 'absolute', zIndex: theme.zIndex.popover, left: 0, right: 0,
		marginBottom: theme.spacing.unit * 3, marginTop: theme.spacing.unit * 0,
		maxHeight: theme.spacing.unit * 30, overflow: 'auto',
	}
}));
SelectField = withStyles(styleSheet)(SelectField);

export default SelectField;

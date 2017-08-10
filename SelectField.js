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
	constructor(props){ super(props); }
	componentDidMount(){ if(this.props.highlighted){
		var target= ReactDOM.findDOMNode(this); 
		target.parentNode.parentNode.scrollTop = target.offsetTop;
	}}
	componentWillReceiveProps(nextProps){
		if(this.props.highlighted != nextProps.highlighted){
			if(nextProps.highlighted) {
				var target= ReactDOM.findDOMNode(this); 
				target.parentNode.parentNode.scrollTop = target.offsetTop;
			}
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
		this.state = { open: false, lockOpen: false, highlighted: this.props.value, searchKey: "" };
	}
	
	shouldComponentUpdate(nextProps, nextState){
		if(nextState != this.state || nextProps != this.props) return true;
		return false;
	}
	
	// Open & Close options //
	handleOnBlur = () => setTimeout(() => { if(!this.state.lockOpen){this.setState({open: false, highlighted: this.props.value, searchKey: ""});} }, 250);
	handleOnClick = () => this.setState({ open: !this.state.open, lockOpen: false, highlighted: this.props.value, searchKey: "" });
	handleOnClickContainer = () => this.setState({ lockOpen: true });
	handleOnClickOption = (value) => { this.setState({ open: false, lockOpen: false, highlighted: this.props.value, searchKey: "" }); this.props.onChange(value); };
	
	
	handleOnKeyDown = (event) => {
		var key = event.key.toUpperCase(); console.log(key);
		if(key !== "TAB") event.preventDefault();
		if(key === "ESCAPE"){
			this.setState({ open: false, lockOpen: false, highlighted: this.props.value, searchKey: "" });
		}else if(key === "ENTER"){
			if(this.state.open){
				this.setState({ open: false, lockOpen: false, searchKey: "" });
				this.props.onChange(this.state.highlighted);
			}else{
				this.setState({ open: true, lockOpen: false, highlighted: this.props.value, searchKey: "" });
			}
		}else if(key === "ARROWUP" || key === "ARROWDOWN"){
			var index = this.props.children.findIndex((option) => option.value == this.state.highlighted);
			if(key === "ARROWDOWN"){ if(index<this.props.children.length-1) index++; } 
			else if(index>0) index--;
			this.setState({ highlighted: this.props.children[index].value });
		}else if(key==" " || key.isLetter()){ // Search & Scroll to options //
			if(this.state.searchKey == "")setTimeout(() => this.setState({searchKey: ""}), 1000);
			var searchKey = this.state.searchKey + key;
			var target = this.props.children.find((option) => option.name.toUpperCase().startsWith(searchKey));
			if(target) this.setState({highlighted:target.value, searchKey:searchKey});
			else this.setState({highlighted: "", searchKey: ""});
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

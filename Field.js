"use strict";

// React imports
import React from "react";
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
// Material-UI imports
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Menu, { MenuItem } from 'material-ui/Menu';
import TextField from 'material-ui/TextField';

class SelectField extends React.Component {
	constructor(props){
		super(props);
		this.state = { open: false, anchorEl: undefined, };
	}
	
	handleClick = event => { this.setState({ open: true, anchorEl: event.currentTarget }); };
	handleRequestClose = () => { this.setState({ open: false }); };
	handleMenuItemClick = (event, index) => { this.setState({ open: false }); this.props.onChange(index); };
	
	render(){
		const { fullWidth, style, name, label, value, onChange, children } = this.props;
		return (
			<div>
				<TextField fullWidth={fullWidth} onClick={this.handleClick} type="text" name={name} label={label} value={value} InputProps={{ placeholder: label }} />
				<Menu style={{ maxHeight: '50%' }} MenuListProps={{ style: { width: '350px', maxWidth: 'calc(100vw - 100px)' }}} open={this.state.open} anchorEl={this.state.anchorEl} onRequestClose={this.handleRequestClose} >
					{children.map((option) =>
						<MenuItem key={option.value} selected={option.value === this.props.value} onClick={event => this.handleMenuItemClick(event, option.value)} >
							{option.name}
						</MenuItem>,
					)}
				</Menu>
			</div>			
		);
	}
}

class SuggestField extends React.Component {
	constructor(props){
		super(props);
		this.state = { value: '', suggestions: [] };
	}
	
	static propTypes = {
		classes: PropTypes.object.isRequired,
		getSuggestions: PropTypes.func.isRequired,
		getSuggestionValue: PropTypes.func.isRequired
	};
	
	renderInput(props) {
		const { ref, inputClasses, ...other } = props;
		return (<TextField inputRef={ref} classes={inputClasses} {...other} />);
	}
	
	renderSuggestionsContainer(props) {
		const { containerProps, children } = props;
		return (<Paper square {...containerProps}>{children}</Paper>);
	}
	
	renderSuggestion = (suggestion, { query, isHighlighted }) => {
		var value = this.props.getSuggestionValue(suggestion);
		//const matches = match(value, query); const parts = parse(value, matches);
		
		return (
			<MenuItem selected={isHighlighted} component="div">
				<div>
					{value}{/*
					parts.map((part, index) => { return part.highlight ? <span key={index} style={{ fontWeight: 300 }}>{part.text}</span> : <strong key={index} style={{ fontWeight: 500 }}>{part.text}</strong>; })
					*/}
				</div>
			</MenuItem>
		);
	};
	
	handleAsyncSuggestionsFetchRequested = ({ value }) => this.props.getSuggestions(value).done(response => this.setState({suggestions: response}));
	handleSuggestionsFetchRequested = ({ value }) => this.setState({ suggestions: this.props.getSuggestions(value) });
	handleSuggestionsClearRequested = () => this.setState({ suggestions: [] });
	handleChange = (event, { newValue }) => this.setState({ value: newValue });
	
	render(){
		const { classes, async, getSuggestions, getSuggestionValue, alwaysRenderSuggestions, ...props } = this.props;
		
		const containerClass = this.props.fullWidth ? classes.containerFullWidth : classes.container;
		const handleSuggestionsFetchRequested = async ? this.handleAsyncSuggestionsFetchRequested : this.handleSuggestionsFetchRequested;
		
		return (<Autosuggest
			theme={{
				  container: containerClass,
				  suggestionsContainerOpen: classes.suggestionsContainerOpen,
				  suggestionsList: classes.suggestionsList,
				  suggestion: classes.suggestion
			}}
			alwaysRenderSuggestions={alwaysRenderSuggestions}
			onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
			onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
			suggestions={this.state.suggestions} getSuggestionValue={getSuggestionValue}
			renderSuggestionsContainer={this.renderSuggestionsContainer}
			renderSuggestion={this.renderSuggestion}
			renderInputComponent={this.renderInput}
			inputProps={{ value: this.state.value, onChange: this.handleChange, ...props }}
		/>);
	}
}

const styleSheet = createStyleSheet('SuggestField', theme => ({
	container: { position: 'relative', display: 'inline-block' },
	containerFullWidth: { position: 'relative' },
	suggestionsContainerOpen: {
		position: 'absolute', zIndex: theme.zIndex.popover, left: 0, right: 0,
		marginBottom: theme.spacing.unit * 3, marginTop: theme.spacing.unit * 0,
	},
	suggestionsList: { listStyleType: 'none', margin: 0, padding: 0 },
	suggestion: {},
}));

SuggestField = withStyles(styleSheet)(SuggestField);
export { SelectField, SuggestField };

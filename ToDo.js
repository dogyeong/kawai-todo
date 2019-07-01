import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from "react-native";
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window");

export default class ToDo extends Component {
	static propTypes = {
		text: PropTypes.string.isRequired,
		isCompleted: PropTypes.bool.isRequired,
		deleteToDo: PropTypes.func.isRequired,
		id: PropTypes.string.isRequired,
		unCompleteToDo: PropTypes.func.isRequired,
		completeToDo: PropTypes.func.isRequired,
		updateToDo: PropTypes.func.isRequired,
	}
	constructor(props) {
		super(props);
		this.state = { isEditing: false, toDoValue: props.text }
	}
	state = {
		isEditing: false,
		isCompleted: false,
		toDoValue: "",
	};

	render() {
		const { isEditing, toDoValue } = this.state;
		const { text, id, deleteToDo, completeToDo, unCompleteToDo, isCompleted, updateToDo } = this.props;
		return (
			<View style={styles.container}>
				{/* 왼쪽 체크표시 + 텍스트 */}
				<View style={styles.column}>
					{/* 원형 체크표시 : 누르면 토글된다 */}
					<TouchableOpacity onPress={this._toggleComplete}>
						<View style={[styles.circle, isCompleted ? styles.completedCircle : styles.uncompletedCircle]} />
					</TouchableOpacity>
					{/* 텍스트 부분 : 수정모드가 되면 인풋으로 바뀌고 toDoValue를 기본 값으로 넣어준다 */}
					{isEditing ? (
						<TextInput 
							style={[styles.text, styles.input, isCompleted ? styles.completedText : styles.uncompletedText]} 
							value={toDoValue} 
							multiline={true} 
							onChangeText={this._controlInput} 
							returnKeyType={"done"} 
							onBlur={this._finishEditing}
						/>
					) : (
						<Text style={[styles.text, isCompleted ? styles.completedText : styles.uncompletedText]}>{text}</Text>	
					)}
				</View>

				{/* 오른쪽 Edit + Delete */}
				{isEditing ? (
						<View style={styles.actions}>
							<TouchableOpacity onPressOut={this._finishEditing}>
								<View style={styles.actionContainer}>
									<Text style={styles.actionText}>Done</Text>
								</View>
							</TouchableOpacity>
						</View>
					) : (
						<View style={styles.actions}>
							<TouchableOpacity onPressOut={this._startEditing}>
								<View style={styles.actionContainer}>
									<Text style={styles.actionText}>Edit</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPressOut={() => deleteToDo(id)}>
								<View style={styles.actionContainer}>
									<Text style={styles.actionText}>Delete</Text>
								</View>
							</TouchableOpacity>
						</View>
				)}
			</View>
		);
	}

	_toggleComplete = () => {
		const { isCompleted, unCompleteToDo, completeToDo, id } = this.props;
		if(isCompleted) {
			unCompleteToDo(id);
		}
		else {
			completeToDo(id);
		}
	}
	_startEditing = () => {
		this.setState({ isEditing: true })
	}
	_finishEditing = () => {
		const { toDoValue } = this.state;
		const { id, updateToDo } = this.props;
		updateToDo(id, toDoValue);
		this.setState({ isEditing: false })
	}
	_controlInput = (text) => {
		this.setState({ toDoValue: text })
	}
}

const styles = StyleSheet.create({
	container: {
		width: width-50,
		borderBottomColor: "#bbb",
		borderBottomWidth: StyleSheet.hairlineWidth,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	circle: {
		width: 25,
		height: 25,
		borderRadius: 15,
		borderWidth: 3,
		marginRight: 20
	},
	completedCircle: {
		borderColor: "#bbb",
	},
	uncompletedCircle: {
		borderColor: "#F23657",
	},
	text: {
		fontWeight: "600",
		fontSize: 18,
		marginVertical: 20,
	},
	completedText: {
		color: "#bbb",
		textDecorationLine: "line-through"
	},
	uncompletedText: {
		color: "#353535"
	},
	column: {
		flexDirection: "row",
		alignItems: "center",
		/*justifyContent: "space-between",*/
		width: width / 2,
	},
	actions: {
		flexDirection: "row",
	},
	actionContainer: {
		marginVertical: 10,
		marginHorizontal: 10
	},
	input: {
		width: width / 2,
		marginVertical: 20,
	}
})
import React from "react";
import { Component } from "react";

export default class Counter extends Component {
   constructor(props) {
    super(props);
    this.state = {
        count: 0
    };
   }
   componentDidMount() {
        const c = window.localStorage.getItem("c");
        let cnt = parseInt(c);
        this.setState({count : cnt});
    }
    
    handleCount = async()=> {
        const cnt = this.state.count;
        console.log(cnt);
        this.setState({ count : cnt +1});
        await window.localStorage.setItem("c", cnt+1);

        console.log(window.localStorage.getItem("c"));
    }
    deleteLocalStorage = () => {
        window.localStorage.removeItem("c");
        window.localStorage.removeItem("count");
    }
    render () {
        return (<div>hi{this.state.count}<button onClick={this.handleCount}>눌러</button><button onClick={this.deleteLocalStorage}>삭제</button></div>);
    }
}
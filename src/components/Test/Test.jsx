import React, { Fragment } from 'react';

import styles from './Test.scss'

export default class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
        };
    }
    setIsOpenToFalse = () => {
        this.setState({ isOpen: false })
    }

    render() {
        const { isOpen } = this.state;

        console.log('isOpen', isOpen)

        return (
            <div className={styles.some} onClick={this.setIsOpenToFalse}>
                <img src='img/dog.jpg'></img>
                <div>d</div>
            </div>
        );
    }
}

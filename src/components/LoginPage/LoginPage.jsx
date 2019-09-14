import React, { Fragment } from 'react';

import styles from './LoginPage.scss'

export default class LoginPage extends React.Component {
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


        return (
            <div className={styles.some} onClick={this.setIsOpenToFalse}>
                LOGIN
            </div>
        );
    }
}

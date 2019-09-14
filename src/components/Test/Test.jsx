import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import styles from './Test.scss'

export default class Test extends React.Component {

    static propTypes = {
        onNavigate: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
        };
    }
    setIsOpenToFalse = () => {
        this.setState({ isOpen: false });
        this.props.onNavigate('/login')
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

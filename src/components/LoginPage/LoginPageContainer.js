import { connect } from 'react-redux';
import LoginPage from './LoginPage';

import { push } from 'connected-react-router';

import { login } from 'reducers/auth/authActions';

const mapStateToProps = (state) => {
    return {
        ...state.auth,
    };
};

const mapDispatchToProps = {
    onLogin: login,
    onNavigate: push,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoginPage);

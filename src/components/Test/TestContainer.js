import { connect } from 'react-redux';
import Test from './Test';

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
)(Test);

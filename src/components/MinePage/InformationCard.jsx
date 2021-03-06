import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd-mobile';
import { Link } from 'dva/router';
import { GET_CURRENT_USER } from 'Queries/users.js';
import { Query } from 'react-apollo';
import get from 'Utils/get';
import { DEFAULT_ICON, SERVER_ADDRESS } from 'Utils/constance.js';

export default class InformationCard extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
    }

    render() {
        const { user } = this.props;

        return (

            <Link to={`/home/${user.id}`}>
                <List>
                    <List.Item arrow="horizontal"
                        onClick={() => { }}
                        style={{ padding: '1rem' }}
                        thumb={
                            <div className="christmas-hat">
                                <img
                                    src={user.icon ? `${SERVER_ADDRESS}/uploads/icons/${user.icon}` : DEFAULT_ICON}
                                    style={{ width: '4rem', height: '4rem', borderRadius: '50%' }}
                                />
                            </div>
                        }
                    >
                        {user.name}
                        <List.Item.Brief className="ell">
                            {user.department} | {user.major} | {user.class}
                        </List.Item.Brief>
                    </List.Item>
                </List>
            </Link>
        );
    }
}

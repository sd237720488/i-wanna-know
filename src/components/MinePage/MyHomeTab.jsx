import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd-mobile';
import { Icon, Badge } from 'antd';
import { Link } from 'dva/router';
import { LOGOUT_HREF } from 'Utils/constance';
import { client } from '../../index';
import { GET_INFORMATION_NUM } from 'Queries/information';

export default class InformationCard extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
    }

    state = {
        informationNum: {
            infoNum: 0,
            inviteNum: 0
        }
    }

    componentDidMount() {
        client.query({
            query: GET_INFORMATION_NUM
        }).then(({ data }) => {
            if (data.informationNum) {
                this.setState({ informationNum: data.informationNum });
            }
        });
    }

    render() {
        const { informationNum } = this.state;
        const { history, user } = this.props;
        const { infoNum, inviteNum } = informationNum;

        return (
            <div>
                <List
                    style={{ marginTop: '1rem' }}
                >
                    <List.Item
                        onClick={() => history.push('/notice/default')}
                        extra={<Badge count={infoNum + inviteNum}
                            style={{ margin: 0 }} />}>
                        <Icon type="bell" theme="twoTone" style={{ margin: '0.5rem 1rem' }} />
                        消息中心
                    </List.Item>
                    <List.Item
                        onClick={() => history.push(`/LikedAnswers/${user.id}`)}
                    >
                        <Icon type="like" theme="twoTone" twoToneColor="#eb2f96" style={{ margin: '0.5rem 1rem' }} />
                        我赞过的
                    </List.Item>
                    {/* <List.Item extra="0个">
                        <Icon type="star" theme="twoTone" twoToneColor="#52c41a" style={{ margin: '0.5rem 1rem' }} />
                        收藏集
                    </List.Item> */}
                    <List.Item
                        onClick={() => history.push(`/homeCourse/${user.id}`)}
                    >
                        <Icon type="appstore" theme="twoTone" style={{ margin: '0.5rem 1rem' }} />
                        课程管理
                    </List.Item>
                </List>
                <List style={{ marginTop: '1rem' }} >
                    <List.Item
                        onClick={() => {
                            localStorage.removeItem('token');
                            location.href = LOGOUT_HREF;
                        }}>
                        <Icon
                            type="export"
                            style={{ margin: '0.5rem 1rem', color: '#f02825' }} />
                        退出账号
                    </List.Item>
                </List>
            </div>
        );
    }
}

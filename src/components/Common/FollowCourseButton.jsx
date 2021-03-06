import React, { Component } from 'react';
import { Button, message } from 'antd';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { GET_COURSES, GET_COURSE } from 'Queries/classifications';

const FOLLOW_CLASSIFICATION = gql`
  mutation followClassification($_id: ID!) {
    message: followClassification(_id: $_id) {
        code
        message
    }
  }
`;

const CANCEL_CLASSIFICATION = gql`
mutation cancelFollowClassification($_id: ID!) {
  message: cancelFollowClassification(_id: $_id) {
      code
      message
  }
}
`;

export default class Follow extends Component {
    static propTypes = {
        classification: PropTypes.object.isRequired,
        majorId: PropTypes.string,
        refetch: PropTypes.func,  // 如果有则优先执行重新请求
    }

    followClassification(e, follow) {
        e.preventDefault();
        follow({
            variables:
                { _id: this.props.classification._id }
        });
    }

    cancelFollowClassification(e, cancel) {
        e.preventDefault();
        e.stopPropagation();
        cancel({
            variables:
                { _id: this.props.classification._id }
        });
    }

    update = (cache, msg, isFollowed) => {
        if (msg.code === 200) {
            if (this.props.refetch) {
                this.props.refetch();

                return;
            }

            if (this.props.majorId) {
                const { courses } = cache.readQuery({
                    query: GET_COURSES,
                    variables: {
                        majorId: this.props.majorId
                    }
                });

                cache.writeQuery({
                    query: GET_COURSES,
                    data: {
                        list: courses.list.map((item) => {
                            if (item._id === this.props.classification._id) {
                                item.isFollowed = isFollowed;
                                if (isFollowed) {
                                    item.followedNum++;
                                } else {
                                    item.followedNum--;
                                }
                            }

                            return item;
                        }),
                        total: courses.total
                    }
                });
            } else {
                const { course } = cache.readQuery({
                    query: GET_COURSE,
                    variables: {
                        _id: this.props.classification._id
                    }
                });

                cache.writeQuery({
                    query: GET_COURSE,
                    data: {
                        course: {
                            ...course,
                            isFollowed: isFollowed,
                            followedNum: isFollowed ? course.followedNum + 1 : course.followedNum - 1,
                        }
                    }
                });
            }
        } else {
            message.error(msg.message);
        }
    }

    render() {
        const classification = this.props.classification || {};

        return (
            classification.isFollowed === false ? (
                <Mutation
                    update={
                        (cache, { data }) => {
                            const message = data.message;

                            this.update(cache, message, true);
                        }
                    }
                    mutation={FOLLOW_CLASSIFICATION}
                >

                    {
                        (followClassification, { data, loading }) => (
                            <Button
                                disabled={loading}
                                onClick={(e) => this.followClassification(e, followClassification)}
                                type="primary">关注</Button>
                        )
                    }
                </Mutation>

            ) : (
                    <Mutation
                        update={
                            (cache, { data }) => {
                                const message = data.message;

                                this.update(cache, message, false);
                            }
                        }
                        mutation={CANCEL_CLASSIFICATION}
                    >

                        {
                            (cancel, { data, loading }) => (
                                <Button
                                    disabled={loading}
                                    onClick={(e) => this.cancelFollowClassification(e, cancel)}
                                    type="danger">取关</Button>
                            )
                        }
                    </Mutation>
                )
        );
    }
}
/** 提问页 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'Components/Modal/Modal';
// import PublishModal from 'Components/PublishModal/PublishModal';
import BraftEditor from 'braft-editor';
import { Input, Select, Button, message } from 'antd';
import 'antd/lib/upload/style/css';
import { browserHistory } from 'dva/router';
import Editor from 'Components/Common/Editor';
import 'braft-editor/dist/index.css';
import handleSuccess from 'Utils/successes';
import { graphql, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styles from './Ask.less';
import { SERVER_ADDRESS } from 'Utils/constance';

const { Option } = Select;
const CREATE_QUESTION = gql`
  mutation createQuestion($title: String!, $content: String!, $classificationId: ID!) {
    data: createQuestion(title: $title, content: $content, classificationId: $classificationId) {
      code
      message
    }
  }
`;
const EDIT_QUESTION = gql`
  mutation updateQuestion($title: String!, $content: String!, $_id: ID!) {
    data: updateQuestion(title: $title, content: $content, _id: $_id) {
      code
      message
    }
  }
`;

export default class Ask extends Component {

  state = {
    _id: '',
    isShowPublishModal: false,
    title: '',
    editorState: BraftEditor.createEditorState(null),
    fileList: []
  };

  handleTitleChange = e => {
    this.setState({ title: e.target.value });
  };

  handleContetnChange = editorState => {
    this.setState({ editorState });
  };

  hidePublishModal = () => {
    this.setState({ isShowPublishModal: false });
  };

  publish = createQuestion => {
    const classificationId = this.props.match.params._id;
    const { title, editorState, _id } = this.state;
    // const preview = content.replace(/<[^>]*>/g, '').substr(0, 140);

    if (!title) {
      message.error('请填写标题哦');
    } else if (!editorState.toHTML().replace(/<[^>]*>/g, '')) {
      message.error('内容必须填写哦');
    } else {
      createQuestion({
        variables: {
          title,
          content: editorState.toHTML(),
          classificationId,
          _id
        },
      });
    }
  };

  componentDidMount() {
    const props = this.props.history.location.state;

    if (props) {
      this.setState({
        title: props.title,
        editorState: BraftEditor.createEditorState(props.content),
        _id: props._id
      });
    }
  }

  handlePublishSuccess = ({ data }) => {
    // TODO: 发布完成后跳转到问题详情页
    if (handleSuccess(data)) {
      this.props.history.replace('/');
    }
  };

  render() {
    const { fileList, _id } = this.state;

    return (
      <Mutation
        onCompleted={this.handlePublishSuccess}
        mutation={_id ? EDIT_QUESTION : CREATE_QUESTION}>
        {(publishQuestion, { data }) => (
          <div>
            <input
              value={this.state.title}
              onChange={this.handleTitleChange}
              placeholder="标题"
              type="text"
              className={styles['input-title']}
            />
            <Editor
              onChange={this.handleContetnChange}
              value={this.state.editorState} />
            {/* <LzEditor
              importContent={this.state.content}
              className="maring-bottom-md"
              active={true}
              cbReceiver={this.handleContetnChange}
              uploadProps={{
                action: `${SERVER_ADDRESS}/uploads`,
                onChange: this.handleUpload,
                showUploadList: true,
                listType: 'picture',
                fileList
              }}
              convertFormat="markdown"
              removeStyle={false}
            /> */}
            <Button
              onClick={() => this.publish(publishQuestion)}
              type="primary"
              size="large"
              className={styles['btn-submit']}>
              发布
            </Button>
            {/* <PublishModal
              handleClassificationSelect={this.handleClassificationSelect}
              handleCancel={this.hidePublishModal}
              handleOk={() => this.publish(createQuestion)}
              visible={this.state.isShowPublishModal}
            /> */}
          </div>
        )}
      </Mutation>
    );
  }
}

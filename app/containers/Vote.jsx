import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import EntryBox from 'components/EntryBox';
import MainSection from 'components/MainSection';
import Scoreboard from 'components/Scoreboard';
import { createTopic, typing, incrementCount,
  decrementCount, destroyTopic, fetchTopics } from 'actions/topics';
import styles from 'css/components/vote';
import { fetchCategories } from '../actions/categories';

const cx = classNames.bind(styles);

class Vote extends Component {
// getcateg () {
//   axios.get('http://localhost:3001/getslcategories')
//   .then((response) => {res.json(response)})
//   .catch((error) => {res.json(error)})
// }
  //Data that needs to be called before rendering the component
  //This is used for server side rending via the fetchComponentDataBeforeRender() method
  static need = [  // eslint-disable-line
  fetchTopics,
  fetchCategories,
  ]

  render() {
  const {newTopic, topics, typing, createTopic, destroyTopic, incrementCount, decrementCount } = this.props;
  return (
    <div className={cx('vote')}>
    <EntryBox topic={newTopic}
      onEntryChange={typing}
      onEntrySave={createTopic} />
    <MainSection topics={topics}
      onIncrement={incrementCount}
      onDecrement={decrementCount}
      onDestroy={destroyTopic} />
    <Scoreboard topics={topics} />
    </div>
  );
  }
}

Vote.propTypes = {
  topics: PropTypes.array.isRequired,
  categories: PropTypes.object.isRequired,
  typing: PropTypes.func.isRequired,
  createTopic: PropTypes.func.isRequired,
  destroyTopic: PropTypes.func.isRequired,
  incrementCount: PropTypes.func.isRequired,
  decrementCount: PropTypes.func.isRequired,
  newTopic: PropTypes.string
};

function mapStateToProps(state) {
  return {
  categories: state.category.categories,
  topics: state.topic.topics,
  newTopic: state.topic.newTopic
  };
}

// Read more about where to place `connect` here:
// https://github.com/rackt/react-redux/issues/75#issuecomment-135436563
export default connect(mapStateToProps, { createTopic, typing, incrementCount, decrementCount, destroyTopic })(Vote);

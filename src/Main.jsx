import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Gatsby from './Gatsby';

import connectToDatoCms from './connectToDatoCms';
import './style.sass';

@connectToDatoCms(plugin => ({
  developmentMode: plugin.parameters.global.developmentMode,
  fieldValue: plugin.getFieldValue(plugin.fieldPath),
  plugin,
}))

export default class Main extends Component {
  static propTypes = {
    plugin: PropTypes.object,
  }

  render() {
    const { plugin } = this.props;
    const { parameters: { global: { instanceUrl } } } = plugin;

    return (
      <div className="container">
        <h1>Gatsby Cloud</h1>
        {instanceUrl
          ? (
            <a href={instanceUrl} alt="Instance url" target="_blank" rel="noopener noreferrer">
              <button
                type="button"
                className="preview__open"
                onClick={() => {}}
              >
                Open Preview
              </button>
            </a>
          )
          : (
            <p>Missing required Gatsby Cloud instance url. Please check your plugin settings.</p>
          )
        }
        <div className="powered__by">
          <p>Powered by: </p>
          <Gatsby />
        </div>
      </div>
    );
  }
}

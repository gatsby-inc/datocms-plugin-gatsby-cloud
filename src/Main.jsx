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
    const { parameters: { global: { instanceName } } } = plugin;
    const instanceUrl = `https://${instanceName}.gtsb.io`;

    return (
      <div className="container">
        <h1>Gatsby Preview</h1>
        {instanceName
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
            <p>Missing required instance name. Please check your plugin settings.</p>
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

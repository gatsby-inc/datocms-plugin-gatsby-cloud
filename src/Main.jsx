import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ExtensionUI } from '@gatsby-cloud-pkg/gatsby-cms-extension-base';

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
    const { fieldPath, parameters: { global: { instanceUrl, authToken } } } = plugin;
    const contentSlug = plugin.getFieldValue(fieldPath);

    return (
      <div className="container">
        <h1>Gatsby Cloud</h1>
        <ExtensionUI
          contentSlug={contentSlug}
          previewInstanceUrl={instanceUrl}
          authToken={authToken}
        />
      </div>
    );
  }
}

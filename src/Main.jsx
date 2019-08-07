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
  };

  constructor(props) {
    super(props);
    this.state = {
      contentSlug: '',
      initalValue: '',
      slugField: '',
    };
    this.slugChange = this.slugChange.bind(this);
  }

  componentDidMount() {
    const { plugin } = this.props;
    const slugField = plugin.itemType.relationships.fields.data
      .map(link => plugin.fields[link.id])
      .find(field => field.attributes.field_type === 'slug');
    if (slugField) {
      const fieldPath = slugField.attributes.api_key;
      this.setState({
        slugField,
        initalValue: plugin.getFieldValue(fieldPath),
      });
      this.unsubscribe = plugin.addFieldChangeListener(fieldPath, this.slugChange);
    }
  }

  componentWillUnmount() {
    const { slugField } = this.state;
    if (slugField) {
      this.unsubscribe();
    }
  }

  slugChange(newValue) {
    this.setState({
      contentSlug: newValue,
    });
  }


  render() {
    const { plugin } = this.props;
    const {
      parameters: {
        global: { siteUrl, authToken },
      },
    } = plugin;
    const { initalValue, contentSlug } = this.state;

    return (
      <div className="container">
        <h1>Gatsby Cloud</h1>
        <ExtensionUI
          contentSlug={contentSlug || initalValue}
          siteUrl={siteUrl}
          authToken={authToken}
        />
      </div>
    );
  }
}

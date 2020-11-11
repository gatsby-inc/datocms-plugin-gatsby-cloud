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
    const urlParts = [];

    const {
      itemType,
      fields,
      locale,
      field,
      parameters: {
        global: { developmentMode, useLocalePath, skipLocalePath },
      },
    } = plugin;

    if (useLocalePath && skipLocalePath !== locale) urlParts.push(locale);

    const slugField = itemType.relationships.fields.data
      .map(link => fields[link.id])
      .find(f => f.attributes.field_type === 'slug');

    const modelslugField = itemType.relationships.fields.data
      .map(link => fields[link.id])
      .find(f => f.attributes.api_key === 'modelslug');

    const modelslugValue = modelslugField.attributes.localized
      ? `${modelslugField.attributes.api_key}.${locale}`
      : modelslugField.attributes.api_key;

    const pathPrefixValue = plugin.getFieldValue(modelslugValue);
    if (pathPrefixValue) urlParts.push(pathPrefixValue);

    if (!slugField) {
      if (developmentMode) {
        console.error('Cannot find a slug field in this model!');
      }

      return;
    }

    if (slugField.attributes.localized && !field.attributes.localized) {
      if (developmentMode) {
        console.error(`Since the "${slugField.attributes.api_key}" slug field is localized, so needs to be the "${field.attributes.api_key}" field!`);
      }

      return;
    }

    const fieldPath = slugField.attributes.localized
      ? `${slugField.attributes.api_key}.${locale}`
      : slugField.attributes.api_key;

    if (fieldPath) urlParts.push(plugin.getFieldValue(fieldPath));

    this.setState({
      slugField,
      initalValue: urlParts.join('/'),
    });

    this.unsubscribe = plugin.addFieldChangeListener(fieldPath, this.slugChange);
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
        global: { instanceUrl, authToken },
      },
    } = plugin;
    const { initalValue, contentSlug } = this.state;

    return (
      <div className="container">
        <h1>Gatsby Cloud</h1>
        <ExtensionUI
          contentSlug={contentSlug || initalValue}
          previewUrl={instanceUrl}
          authToken={authToken}
        />
      </div>
    );
  }
}

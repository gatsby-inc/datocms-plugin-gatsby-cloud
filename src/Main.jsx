import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ExtensionUI } from '@gatsby-cloud-pkg/gatsby-cms-extension-base';

import connectToDatoCms from './connectToDatoCms';
import './style.sass';

// eslint-disable-next-line arrow-parens
@connectToDatoCms(plugin => {
  console.log('pluging opts', plugin);
  return {
    developmentMode: plugin.parameters.global.developmentMode,
    fieldValue: plugin.getFieldValue(plugin.fieldPath),
    plugin,
  };
})
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
    console.log('contructing this bad boi class.....');
  }

  componentDidMount() {
    const { plugin } = this.props;

    const {
      itemType,
      fields,
      locale,
      field,
      parameters: {
        global: { developmentMode },
      },
    } = plugin;

    const slugField = itemType.relationships.fields.data
      .map(link => fields[link.id])
      .find(f => f.attributes.field_type === 'slug');

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

    console.log('things and stuff', slugField, fieldPath);

    this.setState({
      slugField,
      initalValue: plugin.getFieldValue(fieldPath),
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

    console.log('props', this.props);
    console.log('state', this.state);
    console.log('more', instanceUrl, authToken);

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

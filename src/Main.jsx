import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ExtensionUI } from '@gatsby-cloud-pkg/gatsby-cms-extension-base';

import connectToDatoCms from './connectToDatoCms';
import './style.sass';

const GATSBY_PREVIEW_TAB_ID = 'GATSBY_TAB';

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
      updatedAt: '',
    };
    this.slugChange = this.slugChange.bind(this);
  }

  componentDidMount() {
    const { plugin } = this.props;

    const {
      itemType,
      item,
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

    this.setState({
      slugField,
      initalValue: plugin.getFieldValue(fieldPath),
      updatedAt: item.meta.updated_at,
    });

    this.unsubscribe = plugin.addFieldChangeListener(fieldPath, this.slugChange);
  }

  componentWillUnmount() {
    const { slugField } = this.state;
    if (slugField) {
      this.unsubscribe();
    }
  }

  getManifestId = () => {
    const { plugin } = this.props;
    const { item, itemId } = plugin;
    const { updatedAt } = this.state;
    const newUpdatedAt = item.meta.updated_at;

    let manifestId = `${itemId}-${updatedAt}`;
    if (newUpdatedAt !== updatedAt) {
      this.updatedAtChange(newUpdatedAt);
      manifestId = `${itemId}-${newUpdatedAt}`;
    }

    return manifestId;
  }

  getPreviewUrl = () => {
    const { plugin } = this.props;
    const {
      parameters: {
        global: { instanceUrl, contentSyncUrl },
      },
      itemType: { type },
      itemId,
    } = plugin;
    const manifestId = this.getManifestId();

    let previewUrl = instanceUrl;
    if (contentSyncUrl && manifestId) {
      previewUrl = `${contentSyncUrl}/gatsby-source-datocms/${manifestId}/${type}-${itemId}`;
    }

    return previewUrl;
  }

  handleContentSync = () => {
    const previewUrl = this.getPreviewUrl();

    console.info(`opening preview url ${previewUrl}`);
    window.open(previewUrl, GATSBY_PREVIEW_TAB_ID);
  }

  slugChange(newValue) {
    this.setState({
      contentSlug: newValue,
    });
  }

  updatedAtChange(newValue) {
    this.setState({
      updatedAt: newValue,
    });
  }


  render() {
    const { plugin } = this.props;
    const {
      parameters: {
        global: { contentSyncUrl, authToken },
      },
    } = plugin;
    const { initalValue, contentSlug } = this.state;

    return (
      <div className="container">
        <h1>Gatsby Cloud</h1>
        <ExtensionUI
          disablePreviewOpen={!!contentSyncUrl}
          contentSlug={contentSlug || initalValue}
          previewUrl={this.getPreviewUrl()}
          authToken={authToken}
          onOpenPreviewButtonClick={
            contentSyncUrl
              ? this.handleContentSync
              : () => {}
          }
        />
      </div>
    );
  }
}

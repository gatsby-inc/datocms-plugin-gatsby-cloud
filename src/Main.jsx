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
      manifestId: '',
      // buttonDisabled: false,
    };
    this.slugChange = this.slugChange.bind(this);
  }

  componentDidMount() {
    const { plugin } = this.props;

    const {
      itemType,
      itemId,
      item,
      fields,
      locale,
      field,
      parameters: {
        global: { developmentMode },
      },
    } = plugin;

    console.log(item.meta.updated_at);

    const slugField = itemType.relationships.fields.data
      .map(link => fields[link.id])
      .find(f => f.attributes.field_type === 'slug');

    this.setManifestId(itemId, item);

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
    });

    this.unsubscribe = plugin.addFieldChangeListener(fieldPath, this.slugChange);
  }

  componentDidUpdate(prevProps) {
    console.log('prev Props', prevProps);
    const { plugin: prevPlugin } = prevProps;
    const { plugin } = this.props;
    const { itemId, item } = plugin;

    const getUpdatedAt = (currentPlugin) => {
      const { item: currentItem } = currentPlugin;
      return currentItem.meta.updatedAt;
    };

    if (getUpdatedAt(plugin) !== getUpdatedAt(prevPlugin)) {
      this.setManifestId(itemId, item);
    }
  }

  componentWillUnmount() {
    const { slugField } = this.state;
    if (slugField) {
      this.unsubscribe();
    }
  }

  setManifestId = (itemId, item) => {
    const manifestId = `${itemId}-${item.meta.updated_at}`;
    this.setState({ manifestId });
  }

  getPreviewUrl = () => {
    const { plugin } = this.props;
    const {
      parameters: {
        global: { instanceUrl, contentSyncUrl },
      },
    } = plugin;
    const { manifestId } = this.state;

    let previewUrl = instanceUrl;

    if (contentSyncUrl && manifestId) {
      previewUrl = `${contentSyncUrl}/gatsby-source-datocms/${manifestId}`;
    }

    return previewUrl;
  }

  handleContentSync = () => {
    // open a new window with a specific ID
    // the window will open with previewUrl
    // Do we need to wait to get up to date data?
    // left in buttonDisabled if we need to use
    // const { buttonDisabled } = this.state;

    // if (buttonDisabled) {
    //   return;
    // }

    // this.setState({ buttonDisabled: false });

    const previewUrl = this.getPreviewUrl();

    console.info(`opening preview url ${previewUrl}`);
    window.open(previewUrl, GATSBY_PREVIEW_TAB_ID);
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
        global: { contentSyncUrl, authToken },
      },
    } = plugin;
    const { initalValue, contentSlug } = this.state;

    console.log(plugin);

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

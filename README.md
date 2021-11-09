# Gatsby Preview DatoCMS plugin

Plugin that allows access to Gatsby Preview instances

## Setup

To get setup quickly with this extension, use Quick Connect on your Gatsby Cloud Site, otherwise you can follow the manual configuration below:

## Manual Configuration

In DatoCMS, your project is served to a DatoCMS subdomain. Click on "Enter project" then go to Settings -> Plugins -> Gatsby Cloud and install.

Please specify the [Content Sync URL](https://www.gatsbyjs.com/docs/conceptual/content-sync/) (optional, this is a new Gatsby feature), Gatsby Preview instance url (optional) and auth token (optional) in the plugin global settings.

Next, click on the Models option in the sidebar. This should open up your "product name" settings. Click on the settings of your product and select additional settings.

This is where the "Enable draft/published system" Option is selected. So that changes you save are available in your Gatsby Preview, but not pushed to production.

![Enable draft/published system](https://res.cloudinary.com/ekwuno/image/upload/v1586171014/Screenshot_2020-04-06_at_12.01.23.png)

Last step will be adding the "Open Preview" button to the Model. Click on the model you wish to add it to, add a new JSON field. Name it "Gatsby Preview", click on the Presentation tab and select Gatsby Cloud as the field editor.

![Configuration screenshot](https://user-images.githubusercontent.com/51924260/140951021-8c20db29-b162-4f8b-9b02-1438d98532b9.png)

## Plugin 

Once you've configured the plugin, you will be able to see it as a sidebar widget. 

![Plugin screenshot](https://user-images.githubusercontent.com/18426780/61498855-37e35a00-a982-11e9-8201-ab96be74f1f1.png)

Note for those NOT using Content Sync: if the slug field is localized in a specific model, so needs to be the JSON field on which the plugin gets installed.


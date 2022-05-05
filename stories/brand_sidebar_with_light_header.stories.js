import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import brand_sidebar_with_light_header from '../components/brand_sidebar_with_light_header';
import '../components/brand_sidebar_with_light_header/brand_sidebar_with_light_header.scss';

storiesOf('brand_sidebar_with_light_header', module)
	.add('insert different states here', () => {
		return <brand_sidebar_with_light_header />;
	});
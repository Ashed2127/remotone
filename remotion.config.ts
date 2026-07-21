import {Config} from '@remotion/cli/config';
import {WebpackConfiguration} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// Configure webpack to handle path aliases
Config.setWebpackConfig({
	resolve: {
		alias: {
			'@': require('path').resolve(__dirname, 'src'),
		},
	},
} as WebpackConfiguration);

export default Config;
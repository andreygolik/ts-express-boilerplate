/* eslint node/no-unpublished-import: 0 */
/* eslint import/no-extraneous-dependencies: 0 */

import shell from 'shelljs';

shell.cp('-R', 'src/views', 'dist/');
shell.cp('-R', 'src/public/javascript/lib', 'dist/public/javascript/');
shell.cp('-R', 'src/public/stylesheets/lib', 'dist/public/stylesheets/');
shell.cp('-R', 'src/public/fonts', 'dist/public/');
shell.cp('-R', 'src/public/images', 'dist/public/');

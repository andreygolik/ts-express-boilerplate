import shell from 'shelljs';

shell.cp('-R', 'src/views', 'dist/');
shell.cp('-R', 'src/public/javascript/lib', 'dist/javascript/js/');
shell.cp('-R', 'src/public/stylesheets/lib', 'dist/public/stylesheets/');
shell.cp('-R', 'src/public/fonts', 'dist/public/');
shell.cp('-R', 'src/public/images', 'dist/public/');

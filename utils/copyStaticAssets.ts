import shell from 'shelljs';

shell.cp('-R', 'src/views', 'dist/');
shell.cp('-R', 'src/public/js/lib', 'dist/public/js/');
shell.cp('-R', 'src/public/styles/lib', 'dist/public/styles/');
shell.cp('-R', 'src/public/fonts', 'dist/public/');
shell.cp('-R', 'src/public/images', 'dist/public/');

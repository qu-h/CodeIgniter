<?php

# Load the template library when the spark is loaded
$autoload['libraries'] = array('template');
$autoload['libraries'][] = 'smarty';

$autoload['helper'] = array('messages','ci_smarty_function','template','assets');
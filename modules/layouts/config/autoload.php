<?php

# Load the template library when the spark is loaded
$autoload['libraries'] = array('Template');
$autoload['libraries'][] = 'Smarty';

$autoload['helper'] = array('template','messages','ci_smarty_function','assets');
<?php

if ( ! function_exists('trim_title'))
{
    /**
     * Trim Slashes
     *
     * Removes any leading/trailing slashes from a string:
     *
     * /this/that/theother/
     *
     * becomes:
     *
     * this/that/theother
     *
     * @todo	Remove in version 3.1+.
     * @deprecated	3.0.0	This is just an alias for PHP's native trim()
     *
     * @param	string
     * @return	string
     */
    function trim_title($str)
    {
        return trim($str," \t\n\r".chr(0xC2).chr(0xA0));;
    }
}
<?php


/**
 * Parse out the attributes
 *
 * Some of the functions use this
 *
 * @access	private
 * @param	array
 * @param	bool
 * @return	string
 */
if ( ! function_exists('_parse_attributes'))
{
    function _parse_attributes($attributes, $javascript = FALSE)
    {
        if (is_string($attributes))
        {
            return ($attributes != '') ? ' '.$attributes : '';
        }

        $att = '';
        foreach ($attributes as $key => $val)
        {
            if ($javascript == TRUE)
            {
                $att .= $key . '=' . $val . ',';
            }
            else
            {
                $att .= ' ' . $key . '="' . $val . '"';
            }
        }

        if ($javascript == TRUE AND $att != '')
        {
            $att = substr($att, 0, -1);
        }

        return $att;
    }
}

function base64url_encode($data) {
    bug(base64_encode($data));
    bug(strtr(base64_encode($data), '+/', '-_'));
    bug(strtr(base64_encode($data), '+/', '-_'), '=');

    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
}
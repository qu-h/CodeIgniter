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

function number_to_word( $num = '' )
{
    /*
     * copy from https://pageconfig.com/post/number-to-word-conversion-with-php
     */
    $unit_thousand = true;

    $num    = ( string ) ( ( int ) $num );

    if( $unit_thousand == true ){
        $num *= 1000;
    }
    if( ( int ) ( $num ) && ctype_digit( $num ) )
    {
        $words  = array( );

        $num    = str_replace( array( ',' , ' ' ) , '' , trim( $num ) );

        $list1  = [
            '',
            lang('one'), lang('two'), lang('three'), lang('four'), lang('five'),
            lang('six'), lang('seven'), lang('eight'), lang('nine'),lang('ten'),
            lang('eleven'),
            lang('twelve'),
            lang('thirteen'),
            lang('fourteen'),
            lang('fifteen'),
            lang('sixteen'),
            lang('seventeen'),
            lang('eighteen'),
            lang('nineteen'),
        ];

        $list2  = ['',
            lang('ten'),
            lang('twenty'),
            lang('thirty'),
            lang('forty'),
            lang('fifty'),
            lang('sixty'),
            lang('seventy'),
            lang('eighty'),
            lang('ninety'),
            lang('hundred')
        ];

        $list3  = ['',
            lang('thousand'),
            lang('million'),
            'billion',
            'trillion',
            'quadrillion','quintillion','sextillion','septillion',
            'octillion','nonillion','decillion','undecillion',
            'duodecillion','tredecillion','quattuordecillion',
            'quindecillion','sexdecillion','septendecillion',
            'octodecillion','novemdecillion','vigintillion'];

        $num_length = strlen( $num );
        $levels = ( int ) ( ( $num_length + 2 ) / 3 );
        $max_length = $levels * 3;
        $num    = substr( '00'.$num , -$max_length );
        $num_levels = str_split( $num , 3 );

        foreach( $num_levels as $num_part )
        {
            $levels--;
            $hundreds   = ( int ) ( $num_part / 100 );
            //$hundreds   = ( $hundreds ? ' ' . $list1[$hundreds] . ' Hundred' . ( $hundreds == 1 ? '' : 's' ) . ' ' : '' );
            $hundreds   = ( $hundreds ? ' ' . $list1[$hundreds] . " ".lang('hundred').' ' : '' );
            $tens       = ( int ) ( $num_part % 100 );
            $singles    = '';

            if( $tens < 20 )
            {
                $tens   = ( $tens ? ' ' . $list1[$tens] . ' ' : '' );
            }
            else
            {
                $tens   = ( int ) ( $tens / 10 );
                $tens   = ' ' . $list2[$tens] . ' ';
                $singles    = ( int ) ( $num_part % 10 );
                $singles    = ' ' . $list1[$singles] . ' ';
            }
            $words[]    = $hundreds . $tens . $singles . ( ( $levels && ( int ) ( $num_part ) ) ? ' ' . $list3[$levels] . ' ' : '' );
        }

        $commas = count( $words );

        if( $commas > 1 )
        {
            $commas = $commas - 1;
        }

        $words  = implode( ', ' , $words );

        //Some Finishing Touch
        //Replacing multiples of spaces with one space
        $words  = trim( str_replace( ' ,' , ',' , trim_all( ucwords( $words ) ) ) , ', ' );
        if( $commas )
        {
            //$words  = str_replace_last( ',' , " ".lang('and') , $words );
            $words  = str_replace_last( ',' , " " , $words );
        }

        return $words;
    }
    else if( ! ( ( int ) $num ) )
    {
        return 'Zero';
    }
    return '';
}
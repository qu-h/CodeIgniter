<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function VndText($amount=0) {
	if($amount <=0){
		return '';
    	//return $textnumber="Tiền phải là số nguyên dương lớn hơn số 0";
	}
	$Text=array("không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín");
    $TextLuythua =array("","nghìn", "triệu", "tỷ", "ngàn tỷ", "triệu tỷ", "tỷ tỷ");
    $textnumber = "";
    $length = strlen($amount);

        for ($i = 0; $i < $length; $i++){
        	$unread[$i] = 0;
        }

        for ($i = 0; $i < $length; $i++){
            $so = substr($amount, $length - $i -1 , 1);
            if ( ($so == 0) && ($i % 3 == 0) && ($unread[$i] == 0)){
                for ($j = $i+1 ; $j < $length ; $j ++) {
                    $so1 = substr($amount,$length - $j -1, 1);
                    if ($so1 != 0)
                        break;
                }

                if (intval(($j - $i )/3) > 0){
                    for ($k = $i ; $k <intval(($j-$i)/3)*3 + $i; $k++)
                        $unread[$k] =1;
                }
            }
        }

        for ($i = 0; $i < $length; $i++) {
            $so = substr($amount,$length - $i -1, 1);
            if ($unread[$i] ==1)
            continue;
            if ( ($i% 3 == 0) && ($i > 0)){
            	$spaceLuyThua = ', ';
            	// update space
            	if( $textnumber ){
            		$textnumber = $TextLuythua[$i/3] .$spaceLuyThua. $textnumber;
            	} else {
            		$textnumber = $TextLuythua[$i/3];
            	}
            }
            if ($i % 3 == 2 ){
            	$textnumber = 'trăm ' . $textnumber;
            }
            if ($i % 3 == 1){
            	$textnumber = 'mươi ' . $textnumber;
            }
            $textnumber = $Text[$so] ." ". $textnumber;
        }

        //Phai de cac ham replace theo dung thu tu nhu the nay
        $textnumber = str_replace("không mươi", "lẻ", $textnumber);
        $textnumber = str_replace("lẻ không", "", $textnumber);
        $textnumber = str_replace("mươi không", "mươi", $textnumber);
        $textnumber = str_replace("một mươi", "mười", $textnumber);
        $textnumber = str_replace("mươi năm", "mươi lăm", $textnumber);
        $textnumber = str_replace("mươi một", "mươi mốt", $textnumber);
        $textnumber = str_replace("mười năm", "mười lăm", $textnumber);

        return ucfirst($textnumber." đồng");
}

function VndTextRound($amount=0){
	$amount = round($amount,0);
	$length = strlen($amount);
	if( $length > 6) {
		$amount = round($amount/100000,0)*100000;
	} else {
		$amount = round($amount/1000,0)*1000;
	}
	return VndText($amount);
}
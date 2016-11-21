var i18n={
	loading:'Đang tải dữ liệu ...',
	refresh_time:function(i){
		return 'Tự động tải dữ liệu '+i+' giây';
	},
	last_update:'',
	moving_device:function(m,t,time){
		$date = '';
		if(time){
			$time = new Date(time*1000);
			$hours = ($time.getHours() > 10)?$time.getHours():'0'+$time.getHours();
			$minutes = ($time.getMinutes() > 10)?$time.getMinutes():'0'+$time.getMinutes();
			$seconds = ($time.getSeconds() >10 )?$time.getSeconds():'0'+$time.getSeconds();
			$month = (($time.getMonth()+1) > 10)?($time.getMonth()+1):'0'+($time.getMonth()+1);
			//$date = $time.getHours()+' giờ '+$time.getMinutes()+' phút '+$time.getSeconds()+' giây, ngày '+$time.getDate()+'/'+($time.getMonth()+1)+'/'+$time.getFullYear();
			$date = 'Vào lúc '+$hours+':'+$minutes+':'+$seconds+' ngày '+$time.getDate()+'/'+$month+'/'+$time.getFullYear();
		}
		return 'Có '+m+'/'+t+' thiết bị đang di chuyển. ( '+$date+')';
	},
	search:'Tìm Kiếm',
	search_reset:'Xóa Kết Quả Tìm Kiếm',
	node_stop:'Điểm Dừng',
	date_from:'Từ ngày',
	date_in_day:'Trong ngày',
	date_not_empty:'Bạn Phải Chọn Ngày Bắt Đầu',
	date_option_oneday:'<< Xem Trong Ngày',
	date_option_twoday:'Xem Nhiều Ngày >>',
	motor_not_empty:'Bạn Phải Chọn Một Phương Tiện',
	top_time:'Thời Gian Dừng',
	stop_lable:'Thời Gian Dừng',
	time:'Thời Gian',
	speed:'Vận Tốc',
	speed_lable:'Vận Tốc Di Chuyển',
	gps_lable:'Tín Hiệu GPS',
	gsm_lable:'Tín Hiệu GSM',
	temp:'Nhiệt Độ Trong Xe',
	temp_lable:'Nhiệt Độ Trong Xe',
	time_lable:'Thời Gian Cập Nhật vào lúc',
	door_lable:'Trạng Thái Cửa Xe',
	fuel_lable:'Nhiên Liệu Trong Bình',
	cooler_lable:'Trạng Thái Điều Hòa',
	vaq_lable:'Điện Áp Nguồn',
	latitude:'Kinh Tuyến',
	longitude:'Vĩ Tuyến',
	replay:'Chạy Lại',
	stop:'Tạm Dừng',
	start:'Bắt Đầu',
	view_tracking:'Theo Dõi',
	view_report:'Báo Cáo',
	view_history:'Lịch Sử',
	close:'Đóng',
	open:'Mở',
	on:'Bật',
	off:'Tắt',
};
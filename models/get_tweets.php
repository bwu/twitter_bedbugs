<?php

//Get the username from the URL, and check find how we're doing on the Twitter rate limit
$user_name = $_REQUEST['user_name'];
$pages = isset($_REQUEST['count']) && $_REQUEST['count'] > 200 ? $_REQUEST['count'] / 200: 1;
$rate_limit_data = json_decode(file_get_contents('https://api.twitter.com/1/account/rate_limit_status.json'),true);


//If we still have API calls
if($rate_limit_data['remaining_hits']>$pages){
	$data = array();
	
	//Loop over the different pages of the Twitter API based on the "max_id"
	for ($i=1; $i<=$pages; $i++){
		//In the first loop don't include the max_id
		if($i==1){
			$page_data = json_decode(file_get_contents('https://api.twitter.com/1/statuses/user_timeline.json?trim_user=true&include_entities=true&&count=200&screen_name=' . $user_name),true);
			$last_element = end($page_data);
			$max_id = $last_element['id_str'];
			$data += $page_data;
		}
		//In all subsequent loops include the max_id and delete the first element of the returned JSON
		else{
			if(!empty($page_data)){
				$page_data = json_decode(file_get_contents('https://api.twitter.com/1/statuses/user_timeline.json?trim_user=true&include_entities=true&&count=200&screen_name=' . $user_name . '&max_id=' . $max_id),true);
				array_shift($page_data);
				$last_element = end($page_data);
				$max_id = $last_element['id_str'];
				$data = array_merge($data, $page_data);
			}
		}
	}
	$response = $data;
}
else{
	$response = 'rest';
}

// Create headers and send response
header('Cache-Control: no-cache, must-revalidate');
header('Content-type: application/json');
echo json_encode($response);

?>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <title>
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <!-- Le styles -->
    <link href="assets/css/styles.css" rel="stylesheet">
    <link href="assets/css/reset.css" rel="stylesheet">
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script type="text/javascript" src="assets/js/handlebars.js" charset="utf-8"></script>
    <script type="text/javascript" src="assets/js/scripts.js" charset="utf-8"></script>
    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js">
      </script>
    <![endif]-->
  </head>
  
  <body>
		<div id="input_container" class="outer">
			<div id="input_inner_container" class="inner">
		    <input id="user_name"></input>
		    <button id="run">Run</button>
		  </div>
		</div>
		<div id="results_container">
				<table id="results_table" class="table">
					<thead>
					  <td id="tweet_text">Tweet</td>
					  <td id="retweets">Retweets</td>
					  <td id="favorites">Favorites</td>
					</thead>
					<tbody id="results" class="pagination_content">
					</tobdy>
				</table>
		</div>
		<script id="item_template" type="text/x-handlebars-template">
		  <tr>
		    <td>{{this.text}}</td>
		    <td>{{this.retweet_count}}</td>
		    <td>{{this.favorite_count}}</td>
		  </tr>
		</script>
  </body>

</html>
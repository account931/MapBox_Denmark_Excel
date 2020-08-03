<?php

include "../Library/SimpleXLSX.php";

echo '<h1>Parse books.xslx</h1>';



if ( $xlsx = SimpleXLSX::parse('../excel_file.xlsx') ) {
	//print_r( $xlsx->rows() );
	
	echo '<table border="1" cellpadding="3" style="border-collapse: collapse">';
	foreach( $xlsx->rows() as $r ) {
		//echo '<tr><td>'.implode('</td><td>', $r ).'</td></tr>';  //show all rows
		
	    echo '<tr> <td>'. $r[0].'</td>  <td>'. $r[1]. '</td> <td>'. $r[2]. '</td> </tr>'; //show only specific rows

	}
	echo '</table>';
	// or $xlsx->toHTML();	
	
	
	
} else {
	echo SimpleXLSX::parseError();
}
echo '<pre>';


?>